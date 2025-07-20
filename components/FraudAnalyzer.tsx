import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';

interface AnalysisResult {
  score: number;
  level: 'safe' | 'suspicious' | 'danger';
  flags: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  domainInfo?: {
    domain: string;
    age: string;
    reputation: string;
  };
  analysis: string;
}

export function FraudAnalyzer() {
  const [emailContent, setEmailContent] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [emailResult, setEmailResult] = useState<AnalysisResult | null>(null);
  const [urlResult, setUrlResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('email');

  // Enhanced fraud detection algorithms
  const suspiciousEmails = [
    "support@paypal.verify.com", "admin@updatemybank.ru", "security@bankofamerica-update.com",
    "noreply@amazon.secure-verify.net", "account@microsoft-security.co", "service@apple-id-locked.org"
  ];

  const redFlagDomains = [
    "xyz", "tk", "ml", "ga", "cf", "phishing.com", "scamlink.net", 
    "secure-bank.tk", "paypal-verify.ml", "amazon-security.xyz"
  ];

  const phishingKeywords = [
    "urgent", "verify account", "suspended", "click here", "act now", "limited time",
    "congratulations", "you've won", "claim now", "update payment", "confirm identity",
    "security alert", "unusual activity", "account locked", "expires today", "final notice"
  ];

  const suspiciousPatterns = [
    /\b\d{4}[-\s]\d{4}[-\s]\d{4}[-\s]\d{4}\b/, // Credit card pattern
    /\b\d{3}[-\s]\d{2}[-\s]\d{4}\b/, // SSN pattern
    /password.*[:=]\s*\w+/i, // Password requests
    /pin.*[:=]\s*\d+/i, // PIN requests
  ];

  const extractEmailFromContent = (content: string): string | null => {
    const emailMatch = content.match(/from:\s*([^\s@]+@[^\s@]+\.[^\s@]+)/i);
    return emailMatch ? emailMatch[1].toLowerCase() : null;
  };

  const analyzeEmailSender = (content: string): { flags: any[], score: number } => {
    const flags = [];
    let score = 100;
    
    const senderEmail = extractEmailFromContent(content);
    if (senderEmail) {
      if (suspiciousEmails.includes(senderEmail)) {
        flags.push({ 
          type: 'Known Suspicious Sender', 
          severity: 'high' as const, 
          description: `Sender ${senderEmail} is in our fraud database` 
        });
        score -= 40;
      }

      const domain = senderEmail.split('@')[1];
      if (domain) {
        for (let redDomain of redFlagDomains) {
          if (domain.includes(redDomain)) {
            flags.push({ 
              type: 'Suspicious Domain', 
              severity: 'high' as const, 
              description: `Domain contains high-risk TLD or pattern: ${redDomain}` 
            });
            score -= 35;
            break;
          }
        }

        if (domain.includes('paypal') && !domain.endsWith('paypal.com')) {
          flags.push({ 
            type: 'Domain Impersonation', 
            severity: 'high' as const, 
            description: 'Domain mimics legitimate PayPal but is not official' 
          });
          score -= 45;
        }
      }
    }

    return { flags, score };
  };

  const mockAnalyzeEmail = async (content: string): Promise<AnalysisResult> => {
    setProgress(20);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProgress(60);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProgress(100);

    const flags = [];
    let score = 95;

    const senderAnalysis = analyzeEmailSender(content);
    flags.push(...senderAnalysis.flags);
    score = Math.min(score, senderAnalysis.score);

    const lowerContent = content.toLowerCase();
    
    let keywordCount = 0;
    phishingKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword.toLowerCase())) {
        keywordCount++;
      }
    });

    if (keywordCount >= 3) {
      flags.push({ 
        type: 'Multiple Phishing Keywords', 
        severity: 'high' as const, 
        description: `Contains ${keywordCount} suspicious keywords indicating phishing attempt` 
      });
      score -= 35;
    } else if (keywordCount >= 1) {
      flags.push({ 
        type: 'Urgency Tactics', 
        severity: 'medium' as const, 
        description: `Uses pressure tactics with ${keywordCount} suspicious keyword(s)` 
      });
      score -= 15;
    }

    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        flags.push({ 
          type: 'Sensitive Data Request', 
          severity: 'high' as const, 
          description: 'Requests sensitive information like passwords, SSN, or credit cards' 
        });
        score -= 40;
      }
    });

    const level = score >= 80 ? 'safe' : score >= 50 ? 'suspicious' : 'danger';
    
    return {
      score: Math.max(0, score),
      level,
      flags,
      analysis: `Email analysis complete. ${flags.length > 0 ? `Found ${flags.length} red flag(s).` : 'No major issues detected.'} ${
        level === 'safe' ? 'This appears to be legitimate communication.' :
        level === 'suspicious' ? 'Exercise caution with this email and verify sender independently.' :
        'This email shows strong indicators of fraud. Do not respond or click any links.'
      }`
    };
  };

  const mockAnalyzeUrl = async (url: string): Promise<AnalysisResult> => {
    setProgress(25);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProgress(75);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProgress(100);

    const flags = [];
    let score = 90;
    let domainAge = "Unknown";

    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      const domain = urlObj.hostname;
      const protocol = urlObj.protocol;

      for (let redDomain of redFlagDomains) {
        if (domain.endsWith(`.${redDomain}`) || domain.includes(redDomain)) {
          flags.push({ 
            type: 'High-Risk Domain', 
            severity: 'high' as const, 
            description: `Domain uses high-risk TLD or contains suspicious pattern: ${redDomain}` 
          });
          score -= 50;
          domainAge = "Recently registered";
          break;
        }
      }

      if (protocol === 'http:') {
        flags.push({ 
          type: 'Insecure Connection', 
          severity: 'high' as const, 
          description: 'Website does not use HTTPS encryption - data transmitted is not secure' 
        });
        score -= 30;
      }

      if (score < 50) {
        domainAge = "Less than 1 month";
      } else if (score < 70) {
        domainAge = "2-6 months";
      } else if (score < 85) {
        domainAge = "6 months - 1 year";
      } else {
        domainAge = "Over 1 year";
      }

    } catch (error) {
      flags.push({ 
        type: 'Invalid URL Format', 
        severity: 'high' as const, 
        description: 'URL format is invalid or malformed' 
      });
      score = 0;
    }

    const level = score >= 80 ? 'safe' : score >= 50 ? 'suspicious' : 'danger';
    
    return {
      score: Math.max(0, score),
      level,
      flags,
      domainInfo: {
        domain: url.replace(/^https?:\/\//, '').split('/')[0],
        age: domainAge,
        reputation: level === 'safe' ? 'Good' : level === 'suspicious' ? 'Unknown' : 'Poor'
      },
      analysis: `Website analysis complete. ${flags.length > 0 ? `Found ${flags.length} security issue(s).` : 'No major red flags detected.'} ${
        level === 'safe' ? 'This website appears to be legitimate and safe.' :
        level === 'suspicious' ? 'Exercise caution when visiting this website and verify its authenticity.' :
        'This website shows strong indicators of being fraudulent. Avoid visiting or entering personal information.'
      }`
    };
  };

  const analyzeEmail = async () => {
    if (!emailContent.trim()) {
      Alert.alert("Input Required", "Please paste email content to analyze");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setEmailResult(null);

    try {
      const result = await mockAnalyzeEmail(emailContent);
      setEmailResult(result);
      
      Alert.alert(
        "Analysis Complete",
        `Email analyzed - ${result.level} level detected`
      );
    } catch (error) {
      Alert.alert("Analysis Failed", "Could not analyze email content");
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const analyzeUrl = async () => {
    if (!websiteUrl.trim()) {
      Alert.alert("Input Required", "Please enter a website URL to analyze");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setUrlResult(null);

    try {
      const result = await mockAnalyzeUrl(websiteUrl);
      setUrlResult(result);
      
      Alert.alert(
        "Analysis Complete",
        `Website analyzed - ${result.level} level detected`
      );
    } catch (error) {
      Alert.alert("Analysis Failed", "Could not analyze website");
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const getScoreIcon = (level: string) => {
    switch (level) {
      case 'safe': return 'checkmark-circle';
      case 'suspicious': return 'warning';
      case 'danger': return 'shield';
      default: return 'eye';
    }
  };

  const renderResult = (result: AnalysisResult) => {
    const scoreIcon = getScoreIcon(result.level);
    
    return (
      <Card style={styles.resultCard}>
        <CardHeader>
          <View style={styles.resultHeader}>
            <View style={styles.resultHeaderLeft}>
              <Ionicons name={scoreIcon as any} size={24} color="#22c55e" />
              <View style={styles.resultHeaderText}>
                <CardTitle style={styles.resultTitle}>Analysis Result</CardTitle>
                <CardDescription>{result.analysis}</CardDescription>
              </View>
            </View>
            <View style={styles.resultHeaderRight}>
              <Text style={styles.scoreText}>{result.score}/100</Text>
              <Badge variant={result.level === 'safe' ? 'default' : 'destructive'} style={styles.levelBadge}>
                {result.level.toUpperCase()}
              </Badge>
            </View>
          </View>
        </CardHeader>
        
        <CardContent style={styles.resultContent}>
          {result.domainInfo && (
            <View style={styles.domainInfo}>
              <View style={styles.domainInfoItem}>
                <Text style={styles.domainInfoLabel}>Domain</Text>
                <Text style={styles.domainInfoValue}>{result.domainInfo.domain}</Text>
              </View>
              <View style={styles.domainInfoItem}>
                <Text style={styles.domainInfoLabel}>Age</Text>
                <Text style={styles.domainInfoValue}>{result.domainInfo.age}</Text>
              </View>
              <View style={styles.domainInfoItem}>
                <Text style={styles.domainInfoLabel}>Reputation</Text>
                <Text style={styles.domainInfoValue}>{result.domainInfo.reputation}</Text>
              </View>
            </View>
          )}

          {result.flags.length > 0 && (
            <View style={styles.flagsSection}>
              <View style={styles.flagsHeader}>
                <Ionicons name="warning" size={16} color="#f59e0b" />
                <Text style={styles.flagsTitle}>
                  Red Flags Detected ({result.flags.length})
                </Text>
              </View>
              <View style={styles.flagsList}>
                {result.flags.map((flag, index) => (
                  <View key={index} style={styles.flagItem}>
                    <Badge 
                      variant={flag.severity === 'high' ? 'destructive' : 'secondary'}
                      style={styles.flagBadge}
                    >
                      {flag.severity}
                    </Badge>
                    <View style={styles.flagContent}>
                      <Text style={styles.flagType}>{flag.type}</Text>
                      <Text style={styles.flagDescription}>{flag.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {result.flags.length === 0 && (
            <View style={styles.noFlags}>
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text style={styles.noFlagsText}>No red flags detected - appears legitimate</Text>
            </View>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Ionicons name="shield" size={32} color="#22c55e" />
            <Text style={styles.title}>
              PhishEye Fraud Analyzer
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Advanced AI-powered analysis to detect phishing emails, suspicious websites, and fraud attempts. 
            Protect yourself and your organization from cyber threats.
          </Text>
        </View>

        <Tabs value={activeTab} onValueChange={setActiveTab} style={styles.tabs}>
          <TabsList style={styles.tabsList}>
            <TabsTrigger value="email">
              Email Analysis
            </TabsTrigger>
            <TabsTrigger value="website">
              Website Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" style={styles.tabContent}>
            <Card>
              <CardHeader>
                <View style={styles.cardHeaderWithIcon}>
                  <Ionicons name="mail" size={20} color="#22c55e" />
                  <CardTitle>Email Content Analysis</CardTitle>
                </View>
                <CardDescription>
                  Paste the suspicious email content below for comprehensive fraud analysis
                </CardDescription>
              </CardHeader>
              <CardContent style={styles.cardContent}>
                <Input
                  placeholder="Paste the email content here (headers, body, links, etc.)..."
                  value={emailContent}
                  onChangeText={setEmailContent}
                  multiline
                  numberOfLines={8}
                  style={styles.emailInput}
                />
                
                {isAnalyzing && (
                  <View style={styles.analyzing}>
                    <View style={styles.analyzingHeader}>
                      <Ionicons name="scan" size={16} color="#22c55e" />
                      <Text style={styles.analyzingText}>Analyzing email content...</Text>
                    </View>
                    <Progress value={progress} style={styles.progress} />
                  </View>
                )}

                <Button 
                  onPress={analyzeEmail}
                  disabled={isAnalyzing || !emailContent.trim()}
                  variant="scan"
                  loading={isAnalyzing}
                  style={styles.analyzeButton}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Email"}
                </Button>
              </CardContent>
            </Card>

            {emailResult && renderResult(emailResult)}
          </TabsContent>

          <TabsContent value="website" style={styles.tabContent}>
            <Card>
              <CardHeader>
                <View style={styles.cardHeaderWithIcon}>
                  <Ionicons name="globe" size={20} color="#22c55e" />
                  <CardTitle>Website Security Analysis</CardTitle>
                </View>
                <CardDescription>
                  Enter a website URL to check for phishing indicators and domain reputation
                </CardDescription>
              </CardHeader>
              <CardContent style={styles.cardContent}>
                <Input
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                />
                
                {isAnalyzing && (
                  <View style={styles.analyzing}>
                    <View style={styles.analyzingHeader}>
                      <Ionicons name="scan" size={16} color="#22c55e" />
                      <Text style={styles.analyzingText}>Checking domain reputation and security...</Text>
                    </View>
                    <Progress value={progress} style={styles.progress} />
                  </View>
                )}

                <Button 
                  onPress={analyzeUrl}
                  disabled={isAnalyzing || !websiteUrl.trim()}
                  variant="scan"
                  loading={isAnalyzing}
                  style={styles.analyzeButton}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Website"}
                </Button>
              </CardContent>
            </Card>

            {urlResult && renderResult(urlResult)}
          </TabsContent>
        </Tabs>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22c55e',
    marginLeft: 12,
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 20,
  },
  tabs: {
    width: '100%',
  },
  tabsList: {
    marginBottom: 24,
  },
  tabContent: {
    gap: 24,
  },
  cardHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardContent: {
    gap: 16,
  },
  emailInput: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  analyzing: {
    gap: 8,
  },
  analyzingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  analyzingText: {
    fontSize: 14,
    color: '#f1f5f9',
  },
  progress: {
    width: '100%',
  },
  analyzeButton: {
    width: '100%',
  },
  resultCard: {
    marginTop: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  resultHeaderText: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
  },
  resultHeaderRight: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  levelBadge: {
    marginTop: 4,
  },
  resultContent: {
    gap: 16,
  },
  domainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  domainInfoItem: {
    flex: 1,
  },
  domainInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f1f5f9',
  },
  domainInfoValue: {
    fontSize: 14,
    color: '#94a3b8',
  },
  flagsSection: {
    gap: 12,
  },
  flagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagsTitle: {
    fontWeight: '500',
    color: '#f1f5f9',
  },
  flagsList: {
    gap: 8,
  },
  flagItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  flagBadge: {
    marginTop: 2,
  },
  flagContent: {
    flex: 1,
  },
  flagType: {
    fontWeight: '500',
    fontSize: 14,
    color: '#f1f5f9',
  },
  flagDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  noFlags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
  },
  noFlagsText: {
    fontWeight: '500',
    color: '#22c55e',
  },
});