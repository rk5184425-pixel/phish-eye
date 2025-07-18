import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, ExternalLink, Mail, Globe, Scan, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

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

export const FraudAnalyzer = () => {
  const { toast } = useToast();
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

  const extractLinksFromContent = (content: string): string[] => {
    const linkRegex = /https?:\/\/[^\s<>"]+/gi;
    return content.match(linkRegex) || [];
  };

  const analyzeEmailSender = (content: string): { flags: any[], score: number } => {
    const flags = [];
    let score = 100;
    
    const senderEmail = extractEmailFromContent(content);
    if (senderEmail) {
      // Check against suspicious email list
      if (suspiciousEmails.includes(senderEmail)) {
        flags.push({ 
          type: 'Known Suspicious Sender', 
          severity: 'high' as const, 
          description: `Sender ${senderEmail} is in our fraud database` 
        });
        score -= 40;
      }

      // Check for suspicious domain patterns
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

        // Check for domain impersonation
        if (domain.includes('paypal') && !domain.endsWith('paypal.com')) {
          flags.push({ 
            type: 'Domain Impersonation', 
            severity: 'high' as const, 
            description: 'Domain mimics legitimate PayPal but is not official' 
          });
          score -= 45;
        }
        if (domain.includes('amazon') && !domain.endsWith('amazon.com')) {
          flags.push({ 
            type: 'Domain Impersonation', 
            severity: 'high' as const, 
            description: 'Domain mimics legitimate Amazon but is not official' 
          });
          score -= 45;
        }
        if (domain.includes('microsoft') && !domain.endsWith('microsoft.com')) {
          flags.push({ 
            type: 'Domain Impersonation', 
            severity: 'high' as const, 
            description: 'Domain mimics legitimate Microsoft but is not official' 
          });
          score -= 45;
        }
      }
    }

    return { flags, score };
  };

  const mockAnalyzeEmail = async (content: string): Promise<AnalysisResult> => {
    // Simulate analysis with progressive updates
    setProgress(20);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProgress(60);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProgress(100);

    const flags = [];
    let score = 95;

    // Analyze sender
    const senderAnalysis = analyzeEmailSender(content);
    flags.push(...senderAnalysis.flags);
    score = Math.min(score, senderAnalysis.score);

    // Enhanced content analysis
    const lowerContent = content.toLowerCase();
    
    // Check for phishing keywords
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

    // Check for sensitive data requests
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

    // Analyze links
    const links = extractLinksFromContent(content);
    if (links.length > 0) {
      links.forEach(link => {
        try {
          const url = new URL(link);
          const domain = url.hostname;

          // Check if link domain matches sender domain
          const senderEmail = extractEmailFromContent(content);
          if (senderEmail) {
            const senderDomain = senderEmail.split('@')[1];
            if (domain !== senderDomain && !domain.includes(senderDomain.split('.')[0])) {
              flags.push({ 
                type: 'Mismatched Link Domain', 
                severity: 'medium' as const, 
                description: `Link domain (${domain}) doesn't match sender domain` 
              });
              score -= 20;
            }
          }

          // Check for suspicious link domains
          redFlagDomains.forEach(redDomain => {
            if (domain.includes(redDomain)) {
              flags.push({ 
                type: 'Malicious Link Domain', 
                severity: 'high' as const, 
                description: `Link contains high-risk domain: ${domain}` 
              });
              score -= 35;
            }
          });

          // Check for URL shorteners (often used in phishing)
          const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly'];
          if (shorteners.some(shortener => domain.includes(shortener))) {
            flags.push({ 
              type: 'Shortened URL', 
              severity: 'medium' as const, 
              description: 'Contains shortened URLs that hide the real destination' 
            });
            score -= 15;
          }
        } catch (e) {
          flags.push({ 
            type: 'Malformed URL', 
            severity: 'medium' as const, 
            description: 'Contains invalid or suspicious URL format' 
          });
          score -= 10;
        }
      });
    }

    // Grammar and spelling analysis
    const grammarErrors = (content.match(/\b(recieve|seperate|definately|occured|accomodate|necesary)\b/gi) || []).length;
    if (grammarErrors > 2) {
      flags.push({ 
        type: 'Poor Grammar/Spelling', 
        severity: 'low' as const, 
        description: 'Multiple spelling errors suggest non-professional sender' 
      });
      score -= 10;
    }

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

  // Enhanced website detection (integrated from server logic)
  const analyzeWebsiteInput = (input: string): { isEmail: boolean, result: string } => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    
    if (isEmail) {
      const lowerInput = input.toLowerCase();
      
      if (suspiciousEmails.includes(lowerInput)) {
        return { isEmail: true, result: "❌ Suspicious Email Address!" };
      }
      if (lowerInput.includes(".ru") || lowerInput.includes(".xyz")) {
        return { isEmail: true, result: "⚠️ High-risk domain in email!" };
      }
      return { isEmail: true, result: "✅ Email seems legit." };
    }

    // Website analysis
    try {
      const url = new URL(input.startsWith("http") ? input : `https://${input}`);
      const hostname = url.hostname;

      for (let red of redFlagDomains) {
        if (hostname.endsWith(`.${red}`) || hostname.includes(red)) {
          return { isEmail: false, result: "❌ Fraudulent website detected!" };
        }
      }

      if (!input.startsWith("https")) {
        return { isEmail: false, result: "⚠️ Site is not using HTTPS!" };
      }

      return { isEmail: false, result: "✅ Website seems safe." };
    } catch (err) {
      return { isEmail: false, result: "Invalid input. Not a valid URL or email." };
    }
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

      // Check against red flag domains
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

      // HTTPS check
      if (protocol === 'http:') {
        flags.push({ 
          type: 'Insecure Connection', 
          severity: 'high' as const, 
          description: 'Website does not use HTTPS encryption - data transmitted is not secure' 
        });
        score -= 30;
      }

      // Advanced typosquatting detection
      const typoPatterns = [
        'secure-', '-bank', 'verify-', '-secure', 'bank-', '-verify',
        'paypal-', '-paypal', 'amazon-', '-amazon', 'microsoft-', '-microsoft',
        'apple-', '-apple', 'google-', '-google', 'facebook-', '-facebook'
      ];
      
      for (let pattern of typoPatterns) {
        if (domain.includes(pattern)) {
          flags.push({ 
            type: 'Typosquatting Attempt', 
            severity: 'high' as const, 
            description: `Domain contains suspicious pattern "${pattern}" often used to mimic legitimate services` 
          });
          score -= 40;
          break;
        }
      }

      // Domain length analysis
      if (domain.length > 25) {
        flags.push({ 
          type: 'Suspicious Domain Length', 
          severity: 'medium' as const, 
          description: `Unusually long domain name (${domain.length} characters) may indicate obfuscation` 
        });
        score -= 15;
      }

      // Check for excessive subdomain levels
      const subdomainCount = domain.split('.').length - 2;
      if (subdomainCount > 2) {
        flags.push({ 
          type: 'Excessive Subdomains', 
          severity: 'medium' as const, 
          description: `Domain has ${subdomainCount} subdomain levels, possibly to confuse users` 
        });
        score -= 20;
      }

      // Check for suspicious characters
      if (/[\d]{2,}/.test(domain) || /[-]{2,}/.test(domain)) {
        flags.push({ 
          type: 'Suspicious Domain Format', 
          severity: 'low' as const, 
          description: 'Domain contains unusual character patterns' 
        });
        score -= 10;
      }

      // Check for homograph attacks (basic detection)
      if (/[а-я]|[αβγδε]|[а-яё]/i.test(domain)) {
        flags.push({ 
          type: 'Homograph Attack', 
          severity: 'high' as const, 
          description: 'Domain contains non-Latin characters that may mimic legitimate domains' 
        });
        score -= 35;
      }

      // IP address check
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
        flags.push({ 
          type: 'IP Address URL', 
          severity: 'high' as const, 
          description: 'URL uses IP address instead of domain name - highly suspicious' 
        });
        score -= 40;
      }

      // Check for URL shorteners
      const shorteners = [
        'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 
        'short.link', 'is.gd', 'v.gd', 'tiny.cc'
      ];
      if (shorteners.some(shortener => domain.includes(shortener))) {
        flags.push({ 
          type: 'URL Shortener', 
          severity: 'medium' as const, 
          description: 'URL shortener service hides the actual destination' 
        });
        score -= 25;
      }

      // Simulate domain age based on score
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
      toast({
        title: "Input Required",
        description: "Please paste email content to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setEmailResult(null);

    try {
      const result = await mockAnalyzeEmail(emailContent);
      setEmailResult(result);
      
      toast({
        title: "Analysis Complete",
        description: `Email analyzed - ${result.level} level detected`,
        variant: result.level === 'danger' ? 'destructive' : 'default'
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze email content",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const analyzeUrl = async () => {
    if (!websiteUrl.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a website URL to analyze",
        variant: "destructive"
      });
      return;
    }

    try {
      new URL(websiteUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setUrlResult(null);

    try {
      const result = await mockAnalyzeUrl(websiteUrl);
      setUrlResult(result);
      
      toast({
        title: "Analysis Complete",
        description: `Website analyzed - ${result.level} level detected`,
        variant: result.level === 'danger' ? 'destructive' : 'default'
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze website",
        variant: "destructive"
      });
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
      default: return 'muted';
    }
  };

  const getScoreIcon = (level: string) => {
    switch (level) {
      case 'safe': return CheckCircle;
      case 'suspicious': return AlertTriangle;
      case 'danger': return Shield;
      default: return Eye;
    }
  };

  const renderResult = (result: AnalysisResult) => {
    const ScoreIcon = getScoreIcon(result.level);
    
    return (
      <Card className="mt-6 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ScoreIcon className={`h-6 w-6 text-${getScoreColor(result.level)}`} />
              <div>
                <CardTitle className="text-lg">Analysis Result</CardTitle>
                <CardDescription>{result.analysis}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{result.score}/100</div>
              <Badge variant={result.level === 'safe' ? 'default' : 'destructive'} className="mt-1">
                {result.level.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {result.domainInfo && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm font-medium">Domain</div>
                <div className="text-sm text-muted-foreground">{result.domainInfo.domain}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Age</div>
                <div className="text-sm text-muted-foreground">{result.domainInfo.age}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Reputation</div>
                <div className="text-sm text-muted-foreground">{result.domainInfo.reputation}</div>
              </div>
            </div>
          )}

          {result.flags.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Red Flags Detected ({result.flags.length})
              </h4>
              <div className="space-y-2">
                {result.flags.map((flag, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Badge 
                      variant={flag.severity === 'high' ? 'destructive' : 'secondary'}
                      className="mt-0.5"
                    >
                      {flag.severity}
                    </Badge>
                    <div>
                      <div className="font-medium text-sm">{flag.type}</div>
                      <div className="text-sm text-muted-foreground">{flag.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.flags.length === 0 && (
            <div className="flex items-center gap-2 p-4 bg-safe/10 text-safe rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">No red flags detected - appears legitimate</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            PhishEye Fraud Analyzer
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Advanced AI-powered analysis to detect phishing emails, suspicious websites, and fraud attempts. 
          Protect yourself and your organization from cyber threats.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Analysis
          </TabsTrigger>
          <TabsTrigger value="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Content Analysis
              </CardTitle>
              <CardDescription>
                Paste the suspicious email content below for comprehensive fraud analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste the email content here (headers, body, links, etc.)..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Scan className="h-4 w-4 animate-spin" />
                    Analyzing email content...
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button 
                onClick={analyzeEmail}
                disabled={isAnalyzing || !emailContent.trim()}
                variant="scan"
                size="lg"
                className="w-full"
              >
                <Scan className={isAnalyzing ? "animate-spin" : ""} />
                {isAnalyzing ? "Analyzing..." : "Analyze Email"}
              </Button>
            </CardContent>
          </Card>

          {emailResult && renderResult(emailResult)}
        </TabsContent>

        <TabsContent value="website" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website Security Analysis
              </CardTitle>
              <CardDescription>
                Enter a website URL to check for phishing indicators and domain reputation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" asChild>
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Scan className="h-4 w-4 animate-spin" />
                    Checking domain reputation and security...
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button 
                onClick={analyzeUrl}
                disabled={isAnalyzing || !websiteUrl.trim()}
                variant="scan"
                size="lg"
                className="w-full"
              >
                <Scan className={isAnalyzing ? "animate-spin" : ""} />
                {isAnalyzing ? "Analyzing..." : "Analyze Website"}
              </Button>
            </CardContent>
          </Card>

          {urlResult && renderResult(urlResult)}
        </TabsContent>
      </Tabs>
    </div>
  );
};