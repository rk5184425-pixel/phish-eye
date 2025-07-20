import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
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

  // Enhanced fraud detection algorithms (same as original)
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

  const extractLinksFromContent = (content: string): string[] => {
    const linkRegex = /https?:\/\/[^\s<>"]+/gi;
    return content.match(linkRegex) || [];
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

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'safe': return 'safe';
      case 'suspicious': return 'warning';
      case 'danger': return 'danger';
      default: return 'secondary';
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
      <Card className="mt-6">
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <Ionicons name={scoreIcon as any} size={24} color="#22c55e" />
              <View>
                <CardTitle className="text-lg">Analysis Result</CardTitle>
                <CardDescription>{result.analysis}</CardDescription>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-foreground">{result.score}/100</Text>
              <Badge variant={result.level === 'safe' ? 'default' : 'destructive'} className="mt-1">
                {result.level.toUpperCase()}
              </Badge>
            </View>
          </View>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {result.domainInfo && (
            <View className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <View>
                <Text className="text-sm font-medium text-foreground">Domain</Text>
                <Text className="text-sm text-muted-foreground">{result.domainInfo.domain}</Text>
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground">Age</Text>
                <Text className="text-sm text-muted-foreground">{result.domainInfo.age}</Text>
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground">Reputation</Text>
                <Text className="text-sm text-muted-foreground">{result.domainInfo.reputation}</Text>
              </View>
            </View>
          )}

          {result.flags.length > 0 && (
            <View>
              <View className="flex-row items-center space-x-2 mb-3">
                <Ionicons name="warning" size={16} color="#f59e0b" />
                <Text className="font-medium text-foreground">
                  Red Flags Detected ({result.flags.length})
                </Text>
              </View>
              <View className="space-y-2">
                {result.flags.map((flag, index) => (
                  <View key={index} className="flex-row items-start space-x-3 p-3 bg-muted rounded-lg">
                    <Badge 
                      variant={flag.severity === 'high' ? 'destructive' : 'secondary'}
                      className="mt-0.5"
                    >
                      {flag.severity}
                    </Badge>
                    <View className="flex-1">
                      <Text className="font-medium text-sm text-foreground">{flag.type}</Text>
                      <Text className="text-sm text-muted-foreground">{flag.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {result.flags.length === 0 && (
            <View className="flex-row items-center space-x-2 p-4 bg-safe/10 rounded-lg">
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text className="font-medium text-safe">No red flags detected - appears legitimate</Text>
            </View>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <ScrollView className="flex-1 px-4 py-8">
      <View className="max-w-4xl mx-auto">
        <View className="text-center mb-8">
          <View className="flex-row items-center justify-center space-x-3 mb-4">
            <Ionicons name="shield" size={32} color="#22c55e" />
            <Text className="text-3xl font-bold text-primary">
              PhishEye Fraud Analyzer
            </Text>
          </View>
          <Text className="text-muted-foreground text-center max-w-2xl mx-auto">
            Advanced AI-powered analysis to detect phishing emails, suspicious websites, and fraud attempts. 
            Protect yourself and your organization from cyber threats.
          </Text>
        </View>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="mail" size={16} color="#64748b" />
                <Text>Email Analysis</Text>
              </View>
            </TabsTrigger>
            <TabsTrigger value="website">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="globe" size={16} color="#64748b" />
                <Text>Website Analysis</Text>
              </View>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <View className="flex-row items-center space-x-2">
                  <Ionicons name="mail" size={20} color="#22c55e" />
                  <CardTitle>Email Content Analysis</CardTitle>
                </View>
                <CardDescription>
                  Paste the suspicious email content below for comprehensive fraud analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Paste the email content here (headers, body, links, etc.)..."
                  value={emailContent}
                  onChangeText={setEmailContent}
                  multiline
                  numberOfLines={8}
                  className="font-mono text-sm"
                />
                
                {isAnalyzing && (
                  <View className="space-y-2">
                    <View className="flex-row items-center space-x-2">
                      <Ionicons name="scan" size={16} color="#22c55e" />
                      <Text className="text-sm text-foreground">Analyzing email content...</Text>
                    </View>
                    <Progress value={progress} className="w-full" />
                  </View>
                )}

                <Button 
                  onPress={analyzeEmail}
                  disabled={isAnalyzing || !emailContent.trim()}
                  variant="scan"
                  loading={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Email"}
                </Button>
              </CardContent>
            </Card>

            {emailResult && renderResult(emailResult)}
          </TabsContent>

          <TabsContent value="website" className="space-y-6">
            <Card>
              <CardHeader>
                <View className="flex-row items-center space-x-2">
                  <Ionicons name="globe" size={20} color="#22c55e" />
                  <CardTitle>Website Security Analysis</CardTitle>
                </View>
                <CardDescription>
                  Enter a website URL to check for phishing indicators and domain reputation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChangeText={setWebsiteUrl}
                />
                
                {isAnalyzing && (
                  <View className="space-y-2">
                    <View className="flex-row items-center space-x-2">
                      <Ionicons name="scan" size={16} color="#22c55e" />
                      <Text className="text-sm text-foreground">Checking domain reputation and security...</Text>
                    </View>
                    <Progress value={progress} className="w-full" />
                  </View>
                )}

                <Button 
                  onPress={analyzeUrl}
                  disabled={isAnalyzing || !websiteUrl.trim()}
                  variant="scan"
                  loading={isAnalyzing}
                  className="w-full"
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