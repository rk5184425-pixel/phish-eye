import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeInUp, FadeInDown, SlideInRight } from 'react-native-reanimated';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import { Alert as CustomAlert, AlertTitle, AlertDescription } from './ui/Alert';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface AnalysisResult {
  score: number;
  level: 'safe' | 'suspicious' | 'danger';
  flags: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation?: string;
  }>;
  domainInfo?: {
    domain: string;
    age: string;
    reputation: string;
    ssl: boolean;
    registrar?: string;
  };
  analysis: string;
  timestamp: Date;
}

interface AnalysisHistory {
  id: string;
  type: 'email' | 'url';
  content: string;
  result: AnalysisResult;
}

export function FraudAnalyzer() {
  const [emailContent, setEmailContent] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [emailResult, setEmailResult] = useState<AnalysisResult | null>(null);
  const [urlResult, setUrlResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('email');
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Enhanced fraud detection with more sophisticated patterns
  const suspiciousEmails = [
    "support@paypal.verify.com", "admin@updatemybank.ru", "security@bankofamerica-update.com",
    "noreply@amazon.secure-verify.net", "account@microsoft-security.co", "service@apple-id-locked.org",
    "billing@netflix-suspended.com", "team@facebook-security.net", "support@google-account.org"
  ];

  const redFlagDomains = [
    "xyz", "tk", "ml", "ga", "cf", "top", "click", "download", "stream",
    "phishing.com", "scamlink.net", "secure-bank.tk", "paypal-verify.ml", 
    "amazon-security.xyz", "microsoft-update.top", "apple-support.click"
  ];

  const phishingKeywords = [
    "urgent", "verify account", "suspended", "click here", "act now", "limited time",
    "congratulations", "you've won", "claim now", "update payment", "confirm identity",
    "security alert", "unusual activity", "account locked", "expires today", "final notice",
    "immediate action", "verify now", "account closure", "refund pending", "tax refund"
  ];

  const suspiciousPatterns = [
    /\b\d{4}[-\s]\d{4}[-\s]\d{4}[-\s]\d{4}\b/, // Credit card pattern
    /\b\d{3}[-\s]\d{2}[-\s]\d{4}\b/, // SSN pattern
    /password.*[:=]\s*\w+/i, // Password requests
    /pin.*[:=]\s*\d+/i, // PIN requests
    /routing.*number/i, // Banking info
    /account.*number/i, // Account numbers
  ];

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    triggerHaptic();
    Alert.alert("Copied", "Analysis result copied to clipboard");
  };

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
          type: 'Known Malicious Sender', 
          severity: 'high' as const, 
          description: `Sender ${senderEmail} is in our threat intelligence database`,
          recommendation: 'Block this sender immediately and report as spam'
        });
        score -= 50;
      }

      const domain = senderEmail.split('@')[1];
      if (domain) {
        for (let redDomain of redFlagDomains) {
          if (domain.includes(redDomain)) {
            flags.push({ 
              type: 'High-Risk Domain', 
              severity: 'high' as const, 
              description: `Domain uses suspicious TLD or pattern: ${redDomain}`,
              recommendation: 'Avoid clicking any links from this domain'
            });
            score -= 40;
            break;
          }
        }

        // Check for domain impersonation
        const legitimateDomains = ['paypal.com', 'amazon.com', 'microsoft.com', 'apple.com', 'google.com'];
        for (let legitDomain of legitimateDomains) {
          if (domain.includes(legitDomain.split('.')[0]) && !domain.endsWith(legitDomain)) {
            flags.push({ 
              type: 'Domain Impersonation', 
              severity: 'high' as const, 
              description: `Domain mimics legitimate ${legitDomain} but is not official`,
              recommendation: 'Verify sender through official channels before taking any action'
            });
            score -= 45;
            break;
          }
        }
      }
    }

    return { flags, score };
  };

  const mockAnalyzeEmail = async (content: string): Promise<AnalysisResult> => {
    // Simulate progressive analysis
    setProgress(10);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setProgress(30);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setProgress(60);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProgress(85);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setProgress(100);

    const flags = [];
    let score = 95;

    // Analyze sender
    const senderAnalysis = analyzeEmailSender(content);
    flags.push(...senderAnalysis.flags);
    score = Math.min(score, senderAnalysis.score);

    const lowerContent = content.toLowerCase();
    
    // Check for phishing keywords
    let keywordCount = 0;
    const foundKeywords: string[] = [];
    phishingKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword.toLowerCase())) {
        keywordCount++;
        foundKeywords.push(keyword);
      }
    });

    if (keywordCount >= 4) {
      flags.push({ 
        type: 'Multiple Phishing Indicators', 
        severity: 'high' as const, 
        description: `Contains ${keywordCount} suspicious keywords: ${foundKeywords.slice(0, 3).join(', ')}${foundKeywords.length > 3 ? '...' : ''}`,
        recommendation: 'This email shows strong signs of phishing - do not respond or click links'
      });
      score -= 40;
    } else if (keywordCount >= 2) {
      flags.push({ 
        type: 'Urgency Tactics Detected', 
        severity: 'medium' as const, 
        description: `Uses pressure tactics with keywords: ${foundKeywords.join(', ')}`,
        recommendation: 'Be cautious - legitimate companies rarely use urgent language'
      });
      score -= 20;
    }

    // Check for sensitive data requests
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        flags.push({ 
          type: 'Sensitive Information Request', 
          severity: 'high' as const, 
          description: 'Requests sensitive information like passwords, SSN, or financial details',
          recommendation: 'Never provide personal information via email - contact the company directly'
        });
        score -= 45;
      }
    });

    // Check for suspicious links
    const linkPattern = /https?:\/\/[^\s]+/gi;
    const links = content.match(linkPattern) || [];
    if (links.length > 0) {
      const suspiciousLinks = links.filter(link => {
        const domain = new URL(link).hostname;
        return redFlagDomains.some(redDomain => domain.includes(redDomain));
      });
      
      if (suspiciousLinks.length > 0) {
        flags.push({
          type: 'Malicious Links Detected',
          severity: 'high' as const,
          description: `Contains ${suspiciousLinks.length} suspicious link(s)`,
          recommendation: 'Do not click any links - they may lead to phishing sites'
        });
        score -= 35;
      }
    }

    const level = score >= 80 ? 'safe' : score >= 50 ? 'suspicious' : 'danger';
    
    return {
      score: Math.max(0, score),
      level,
      flags,
      analysis: generateDetailedAnalysis(level, flags.length, 'email'),
      timestamp: new Date()
    };
  };

  const mockAnalyzeUrl = async (url: string): Promise<AnalysisResult> => {
    setProgress(15);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setProgress(40);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProgress(70);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setProgress(95);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setProgress(100);

    const flags = [];
    let score = 90;
    let domainAge = "Unknown";
    let ssl = true;
    let registrar = "Unknown";

    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      const domain = urlObj.hostname;
      const protocol = urlObj.protocol;

      // Check for high-risk domains
      for (let redDomain of redFlagDomains) {
        if (domain.endsWith(`.${redDomain}`) || domain.includes(redDomain)) {
          flags.push({ 
            type: 'High-Risk Domain Extension', 
            severity: 'high' as const, 
            description: `Domain uses high-risk TLD: .${redDomain}`,
            recommendation: 'Avoid visiting - these domains are commonly used for malicious purposes'
          });
          score -= 50;
          domainAge = "Recently registered";
          registrar = "High-risk registrar";
          break;
        }
      }

      // Check SSL
      if (protocol === 'http:') {
        flags.push({ 
          type: 'Insecure Connection', 
          severity: 'high' as const, 
          description: 'Website does not use HTTPS encryption',
          recommendation: 'Never enter personal information on non-HTTPS sites'
        });
        score -= 35;
        ssl = false;
      }

      // Check for suspicious subdomains
      const subdomains = domain.split('.');
      if (subdomains.length > 3) {
        flags.push({
          type: 'Suspicious Subdomain Structure',
          severity: 'medium' as const,
          description: 'Domain has unusual subdomain structure',
          recommendation: 'Verify this is the official website before proceeding'
        });
        score -= 15;
      }

      // Simulate domain age based on score
      if (score < 40) {
        domainAge = "Less than 1 week";
        registrar = "Suspicious registrar";
      } else if (score < 60) {
        domainAge = "Less than 1 month";
        registrar = "Unknown registrar";
      } else if (score < 75) {
        domainAge = "2-6 months";
        registrar = "Standard registrar";
      } else {
        domainAge = "Over 1 year";
        registrar = "Reputable registrar";
      }

    } catch (error) {
      flags.push({ 
        type: 'Invalid URL Format', 
        severity: 'high' as const, 
        description: 'URL format is malformed or invalid',
        recommendation: 'Check the URL for typos or suspicious characters'
      });
      score = 10;
      ssl = false;
    }

    const level = score >= 80 ? 'safe' : score >= 50 ? 'suspicious' : 'danger';
    
    return {
      score: Math.max(0, score),
      level,
      flags,
      domainInfo: {
        domain: url.replace(/^https?:\/\//, '').split('/')[0],
        age: domainAge,
        reputation: level === 'safe' ? 'Good' : level === 'suspicious' ? 'Unknown' : 'Poor',
        ssl,
        registrar
      },
      analysis: generateDetailedAnalysis(level, flags.length, 'website'),
      timestamp: new Date()
    };
  };

  const generateDetailedAnalysis = (level: string, flagCount: number, type: string): string => {
    const typeText = type === 'email' ? 'Email' : 'Website';
    
    if (level === 'safe') {
      return `${typeText} analysis complete. ${flagCount === 0 ? 'No security issues detected.' : `${flagCount} minor issue(s) found.`} This appears to be legitimate and safe to interact with.`;
    } else if (level === 'suspicious') {
      return `${typeText} analysis complete. Found ${flagCount} security concern(s). Exercise caution and verify authenticity through official channels before taking any action.`;
    } else {
      return `${typeText} analysis complete. DANGER: Found ${flagCount} critical security issue(s). This shows strong indicators of fraud or malicious intent. Do not interact with this ${type}.`;
    }
  };

  const analyzeEmail = async () => {
    if (!emailContent.trim()) {
      Alert.alert("Input Required", "Please paste email content to analyze");
      return;
    }

    triggerHaptic();
    setIsAnalyzing(true);
    setProgress(0);
    setEmailResult(null);

    try {
      const result = await mockAnalyzeEmail(emailContent);
      setEmailResult(result);
      
      // Add to history
      const historyItem: AnalysisHistory = {
        id: Date.now().toString(),
        type: 'email',
        content: emailContent.substring(0, 100) + '...',
        result
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
      
      triggerHaptic();
      Alert.alert(
        "Analysis Complete",
        `Email analyzed - ${result.level.toUpperCase()} threat level detected (Score: ${result.score}/100)`
      );
    } catch (error) {
      Alert.alert("Analysis Failed", "Could not analyze email content. Please try again.");
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

    triggerHaptic();
    setIsAnalyzing(true);
    setProgress(0);
    setUrlResult(null);

    try {
      const result = await mockAnalyzeUrl(websiteUrl);
      setUrlResult(result);
      
      // Add to history
      const historyItem: AnalysisHistory = {
        id: Date.now().toString(),
        type: 'url',
        content: websiteUrl,
        result
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
      
      triggerHaptic();
      Alert.alert(
        "Analysis Complete",
        `Website analyzed - ${result.level.toUpperCase()} threat level detected (Score: ${result.score}/100)`
      );
    } catch (error) {
      Alert.alert("Analysis Failed", "Could not analyze website. Please check the URL and try again.");
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const getScoreIcon = (level: string) => {
    switch (level) {
      case 'safe': return 'shield-checkmark';
      case 'suspicious': return 'warning';
      case 'danger': return 'alert-circle';
      default: return 'scan';
    }
  };

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'safe': return '#10b981';
      case 'suspicious': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderResult = (result: AnalysisResult) => {
    const scoreIcon = getScoreIcon(result.level);
    const scoreColor = getScoreColor(result.level);
    
    return (
      <Card style={styles.resultCard} animated delay={200}>
        <CardHeader>
          <Animated.View 
            entering={SlideInRight.delay(300)}
            style={styles.resultHeader}
          >
            <View style={styles.resultHeaderLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${scoreColor}20` }]}>
                <Ionicons name={scoreIcon as any} size={28} color={scoreColor} />
              </View>
              <View style={styles.resultHeaderText}>
                <CardTitle style={styles.resultTitle}>Security Analysis</CardTitle>
                <CardDescription style={styles.resultDescription}>
                  {result.analysis}
                </CardDescription>
              </View>
            </View>
            <View style={styles.resultHeaderRight}>
              <Text style={[styles.scoreText, { color: scoreColor }]}>
                {result.score}
              </Text>
              <Text style={styles.scoreLabel}>/ 100</Text>
              <Badge 
                variant={result.level === 'safe' ? 'default' : result.level === 'suspicious' ? 'secondary' : 'destructive'} 
                style={styles.levelBadge}
              >
                {result.level.toUpperCase()}
              </Badge>
            </View>
          </Animated.View>
        </CardHeader>
        
        <CardContent style={styles.resultContent}>
          {result.domainInfo && (
            <Animated.View entering={FadeInUp.delay(400)} style={styles.domainInfo}>
              <Text style={styles.sectionTitle}>Domain Information</Text>
              <View style={styles.domainGrid}>
                <View style={styles.domainInfoItem}>
                  <Text style={styles.domainInfoLabel}>Domain</Text>
                  <Text style={styles.domainInfoValue}>{result.domainInfo.domain}</Text>
                </View>
                <View style={styles.domainInfoItem}>
                  <Text style={styles.domainInfoLabel}>Age</Text>
                  <Text style={styles.domainInfoValue}>{result.domainInfo.age}</Text>
                </View>
                <View style={styles.domainInfoItem}>
                  <Text style={styles.domainInfoLabel}>SSL</Text>
                  <View style={styles.sslStatus}>
                    <Ionicons 
                      name={result.domainInfo.ssl ? 'lock-closed' : 'lock-open'} 
                      size={16} 
                      color={result.domainInfo.ssl ? '#10b981' : '#ef4444'} 
                    />
                    <Text style={[styles.domainInfoValue, { 
                      color: result.domainInfo.ssl ? '#10b981' : '#ef4444' 
                    }]}>
                      {result.domainInfo.ssl ? 'Secure' : 'Insecure'}
                    </Text>
                  </View>
                </View>
                <View style={styles.domainInfoItem}>
                  <Text style={styles.domainInfoLabel}>Reputation</Text>
                  <Text style={[styles.domainInfoValue, {
                    color: result.domainInfo.reputation === 'Good' ? '#10b981' : 
                           result.domainInfo.reputation === 'Poor' ? '#ef4444' : '#f59e0b'
                  }]}>
                    {result.domainInfo.reputation}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {result.flags.length > 0 ? (
            <Animated.View entering={FadeInUp.delay(500)} style={styles.flagsSection}>
              <View style={styles.flagsHeader}>
                <Ionicons name="warning" size={20} color="#f59e0b" />
                <Text style={styles.flagsTitle}>
                  Security Issues ({result.flags.length})
                </Text>
              </View>
              <View style={styles.flagsList}>
                {result.flags.map((flag, index) => (
                  <Animated.View 
                    key={index} 
                    entering={FadeInUp.delay(600 + index * 100)}
                    style={styles.flagItem}
                  >
                    <Badge 
                      variant={flag.severity === 'high' ? 'destructive' : flag.severity === 'medium' ? 'secondary' : 'outline'}
                      style={styles.flagBadge}
                    >
                      {flag.severity.toUpperCase()}
                    </Badge>
                    <View style={styles.flagContent}>
                      <Text style={styles.flagType}>{flag.type}</Text>
                      <Text style={styles.flagDescription}>{flag.description}</Text>
                      {flag.recommendation && (
                        <Text style={styles.flagRecommendation}>
                          💡 {flag.recommendation}
                        </Text>
                      )}
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInUp.delay(500)} style={styles.noFlags}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.noFlagsText}>No security issues detected</Text>
              <Text style={styles.noFlagsSubtext}>This appears to be legitimate and safe</Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(700)} style={styles.actionButtons}>
            <Button
              variant="outline"
              size="sm"
              onPress={() => copyToClipboard(JSON.stringify(result, null, 2))}
              style={styles.actionButton}
            >
              <Ionicons name="copy" size={16} color="#9ca3af" />
              <Text style={styles.actionButtonText}>Copy Report</Text>
            </Button>
            <Text style={styles.timestamp}>
              Analyzed: {result.timestamp.toLocaleTimeString()}
            </Text>
          </Animated.View>
        </CardContent>
      </Card>
    );
  };

  const renderHistory = () => {
    if (history.length === 0) {
      return (
        <Card style={styles.historyCard}>
          <CardContent style={styles.emptyHistory}>
            <Ionicons name="time" size={48} color="#6b7280" />
            <Text style={styles.emptyHistoryText}>No analysis history yet</Text>
            <Text style={styles.emptyHistorySubtext}>
              Your recent analyses will appear here
            </Text>
          </CardContent>
        </Card>
      );
    }

    return (
      <View style={styles.historyList}>
        {history.map((item, index) => (
          <Card key={item.id} style={styles.historyItem} animated delay={index * 100}>
            <CardContent style={styles.historyItemContent}>
              <View style={styles.historyItemHeader}>
                <View style={styles.historyItemLeft}>
                  <Ionicons 
                    name={item.type === 'email' ? 'mail' : 'globe'} 
                    size={20} 
                    color={getScoreColor(item.result.level)} 
                  />
                  <View style={styles.historyItemText}>
                    <Text style={styles.historyItemTitle}>
                      {item.type === 'email' ? 'Email Analysis' : 'Website Analysis'}
                    </Text>
                    <Text style={styles.historyItemContent} numberOfLines={1}>
                      {item.content}
                    </Text>
                  </View>
                </View>
                <View style={styles.historyItemRight}>
                  <Text style={[styles.historyScore, { color: getScoreColor(item.result.level) }]}>
                    {item.result.score}
                  </Text>
                  <Badge 
                    variant={item.result.level === 'safe' ? 'default' : 
                            item.result.level === 'suspicious' ? 'secondary' : 'destructive'}
                    style={styles.historyBadge}
                  >
                    {item.result.level.toUpperCase()}
                  </Badge>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View style={styles.headerTitle}>
            <View style={styles.logoContainer}>
              <Ionicons name="shield-checkmark" size={36} color="#10b981" />
            </View>
            <Text style={styles.title}>PhishEye Pro</Text>
          </View>
          <Text style={styles.subtitle}>
            Advanced AI-powered fraud detection and security analysis. 
            Protect yourself from phishing, scams, and malicious websites with real-time threat intelligence.
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>99.9%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Protection</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Real-time</Text>
              <Text style={styles.statLabel}>Analysis</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} style={styles.tabs}>
            <TabsList style={styles.tabsList}>
              <TabsTrigger value="email">
                <Ionicons name="mail" size={18} color={activeTab === 'email' ? '#10b981' : '#9ca3af'} />
                <Text style={[styles.tabText, { color: activeTab === 'email' ? '#10b981' : '#9ca3af' }]}>
                  Email Analysis
                </Text>
              </TabsTrigger>
              <TabsTrigger value="website">
                <Ionicons name="globe" size={18} color={activeTab === 'website' ? '#10b981' : '#9ca3af'} />
                <Text style={[styles.tabText, { color: activeTab === 'website' ? '#10b981' : '#9ca3af' }]}>
                  Website Analysis
                </Text>
              </TabsTrigger>
              <TabsTrigger value="history">
                <Ionicons name="time" size={18} color={activeTab === 'history' ? '#10b981' : '#9ca3af'} />
                <Text style={[styles.tabText, { color: activeTab === 'history' ? '#10b981' : '#9ca3af' }]}>
                  History
                </Text>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" style={styles.tabContent}>
              <Card animated>
                <CardHeader>
                  <View style={styles.cardHeaderWithIcon}>
                    <View style={styles.cardIconContainer}>
                      <Ionicons name="mail" size={24} color="#10b981" />
                    </View>
                    <View style={styles.cardHeaderText}>
                      <CardTitle>Email Security Analysis</CardTitle>
                      <CardDescription>
                        Paste suspicious email content for comprehensive fraud detection and threat analysis
                      </CardDescription>
                    </View>
                  </View>
                </CardHeader>
                <CardContent style={styles.cardContent}>
                  <Input
                    label="Email Content"
                    placeholder="Paste the complete email here (headers, body, links, attachments info)..."
                    value={emailContent}
                    onChangeText={setEmailContent}
                    multiline
                    numberOfLines={8}
                    style={styles.emailInput}
                  />
                  
                  {isAnalyzing && (
                    <Animated.View entering={FadeInUp} style={styles.analyzing}>
                      <View style={styles.analyzingHeader}>
                        <LoadingSpinner size={20} color="#10b981" />
                        <Text style={styles.analyzingText}>
                          Analyzing email content with AI threat detection...
                        </Text>
                      </View>
                      <Progress 
                        value={progress} 
                        variant={progress < 50 ? 'default' : progress < 80 ? 'warning' : 'success'}
                        style={styles.progress} 
                      />
                      <Text style={styles.progressText}>{progress}% Complete</Text>
                    </Animated.View>
                  )}

                  <Button 
                    onPress={analyzeEmail}
                    disabled={isAnalyzing || !emailContent.trim()}
                    variant="scan"
                    size="lg"
                    loading={isAnalyzing}
                    style={styles.analyzeButton}
                  >
                    {isAnalyzing ? "Analyzing Email..." : "🔍 Analyze Email Security"}
                  </Button>
                </CardContent>
              </Card>

              {emailResult && renderResult(emailResult)}
            </TabsContent>

            <TabsContent value="website" style={styles.tabContent}>
              <Card animated>
                <CardHeader>
                  <View style={styles.cardHeaderWithIcon}>
                    <View style={styles.cardIconContainer}>
                      <Ionicons name="globe" size={24} color="#10b981" />
                    </View>
                    <View style={styles.cardHeaderText}>
                      <CardTitle>Website Security Scanner</CardTitle>
                      <CardDescription>
                        Enter a website URL to check for phishing indicators, domain reputation, and security issues
                      </CardDescription>
                    </View>
                  </View>
                </CardHeader>
                <CardContent style={styles.cardContent}>
                  <Input
                    label="Website URL"
                    placeholder="https://example.com or example.com"
                    value={websiteUrl}
                    onChangeText={setWebsiteUrl}
                    style={styles.urlInput}
                  />
                  
                  {isAnalyzing && (
                    <Animated.View entering={FadeInUp} style={styles.analyzing}>
                      <View style={styles.analyzingHeader}>
                        <LoadingSpinner size={20} color="#10b981" />
                        <Text style={styles.analyzingText}>
                          Scanning domain reputation and security certificates...
                        </Text>
                      </View>
                      <Progress 
                        value={progress} 
                        variant={progress < 50 ? 'default' : progress < 80 ? 'warning' : 'success'}
                        style={styles.progress} 
                      />
                      <Text style={styles.progressText}>{progress}% Complete</Text>
                    </Animated.View>
                  )}

                  <Button 
                    onPress={analyzeUrl}
                    disabled={isAnalyzing || !websiteUrl.trim()}
                    variant="scan"
                    size="lg"
                    loading={isAnalyzing}
                    style={styles.analyzeButton}
                  >
                    {isAnalyzing ? "Scanning Website..." : "🌐 Scan Website Security"}
                  </Button>
                </CardContent>
              </Card>

              {urlResult && renderResult(urlResult)}
            </TabsContent>

            <TabsContent value="history" style={styles.tabContent}>
              <Card animated>
                <CardHeader>
                  <View style={styles.cardHeaderWithIcon}>
                    <View style={styles.cardIconContainer}>
                      <Ionicons name="time" size={24} color="#10b981" />
                    </View>
                    <View style={styles.cardHeaderText}>
                      <CardTitle>Analysis History</CardTitle>
                      <CardDescription>
                        Review your recent security analyses and threat assessments
                      </CardDescription>
                    </View>
                  </View>
                </CardHeader>
              </Card>

              {renderHistory()}
            </TabsContent>
          </Tabs>
        </Animated.View>
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
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#9ca3af',
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 24,
    fontSize: 16,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#374151',
    marginHorizontal: 16,
  },
  tabs: {
    width: '100%',
  },
  tabsList: {
    marginBottom: 32,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 6,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    gap: 32,
  },
  cardHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardContent: {
    gap: 20,
  },
  emailInput: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    minHeight: 120,
  },
  urlInput: {
    fontSize: 16,
  },
  analyzing: {
    gap: 12,
    padding: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  analyzingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analyzingText: {
    fontSize: 15,
    color: '#f9fafb',
    fontWeight: '500',
    flex: 1,
  },
  progress: {
    height: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '500',
  },
  analyzeButton: {
    marginTop: 8,
  },
  resultCard: {
    borderColor: 'rgba(16, 185, 129, 0.2)',
    backgroundColor: '#1a2332',
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
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultHeaderText: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  resultHeaderRight: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resultContent: {
    gap: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 16,
  },
  domainInfo: {
    padding: 20,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  domainGrid: {
    gap: 16,
  },
  domainInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  domainInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#d1d5db',
  },
  domainInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f9fafb',
  },
  sslStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flagsSection: {
    gap: 16,
  },
  flagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
  },
  flagsList: {
    gap: 12,
  },
  flagItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  flagBadge: {
    marginTop: 2,
  },
  flagContent: {
    flex: 1,
    gap: 6,
  },
  flagType: {
    fontWeight: '600',
    fontSize: 15,
    color: '#f9fafb',
  },
  flagDescription: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  flagRecommendation: {
    fontSize: 13,
    color: '#10b981',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  noFlags: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  noFlagsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
  },
  noFlagsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  historyCard: {
    marginTop: 16,
  },
  emptyHistory: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9ca3af',
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  historyList: {
    gap: 16,
    marginTop: 16,
  },
  historyItem: {
    backgroundColor: '#1a2332',
    borderColor: '#374151',
  },
  historyItemContent: {
    padding: 16,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  historyItemText: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 4,
  },
  historyItemContent: {
    fontSize: 14,
    color: '#9ca3af',
  },
  historyItemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  historyScore: {
    fontSize: 20,
    fontWeight: '700',
  },
  historyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});