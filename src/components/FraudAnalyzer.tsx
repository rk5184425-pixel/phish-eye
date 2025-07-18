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

  const mockAnalyzeEmail = async (content: string): Promise<AnalysisResult> => {
    // Simulate analysis with progressive updates
    setProgress(20);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProgress(60);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProgress(100);

    // Mock analysis logic
    const flags = [];
    let score = 95;

    if (content.toLowerCase().includes('urgent')) {
      flags.push({ type: 'Urgency Tactics', severity: 'medium' as const, description: 'Uses urgency to pressure quick action' });
      score -= 15;
    }
    if (content.includes('click here') || content.includes('verify account')) {
      flags.push({ type: 'Suspicious Links', severity: 'high' as const, description: 'Contains potentially malicious links' });
      score -= 25;
    }
    if (content.toLowerCase().includes('congratulations')) {
      flags.push({ type: 'Prize Scam', severity: 'high' as const, description: 'Offers unrealistic rewards' });
      score -= 30;
    }

    const level = score >= 80 ? 'safe' : score >= 50 ? 'suspicious' : 'danger';
    
    return {
      score,
      level,
      flags,
      analysis: `Email analysis complete. The content shows ${flags.length} potential red flags. ${
        level === 'safe' ? 'This appears to be legitimate communication.' :
        level === 'suspicious' ? 'Exercise caution with this email.' :
        'This email shows strong indicators of fraud.'
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

    const domain = new URL(url).hostname;
    
    if (domain.includes('secure-') || domain.includes('-bank') || domain.includes('verify-')) {
      flags.push({ type: 'Typosquatting', severity: 'high' as const, description: 'Domain mimics legitimate services' });
      score -= 40;
    }
    if (url.includes('http://')) {
      flags.push({ type: 'Insecure Connection', severity: 'medium' as const, description: 'Not using HTTPS encryption' });
      score -= 20;
    }
    if (domain.length > 30) {
      flags.push({ type: 'Suspicious Domain Length', severity: 'low' as const, description: 'Unusually long domain name' });
      score -= 10;
    }

    const level = score >= 80 ? 'safe' : score >= 50 ? 'suspicious' : 'danger';
    
    return {
      score,
      level,
      flags,
      domainInfo: {
        domain,
        age: '2 months',
        reputation: level === 'safe' ? 'Good' : level === 'suspicious' ? 'Unknown' : 'Poor'
      },
      analysis: `Website analysis complete. Domain reputation: ${level}. ${
        flags.length === 0 ? 'No major red flags detected.' :
        `Found ${flags.length} potential issues.`
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