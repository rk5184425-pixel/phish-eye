import { Shield, Eye, Brain, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms detect sophisticated phishing attempts and fraud patterns",
    color: "primary"
  },
  {
    icon: Eye,
    title: "Typosquatting Detection",
    description: "Identifies domains that mimic legitimate services using character substitution and similar tricks",
    color: "warning"
  },
  {
    icon: Globe,
    title: "Domain Reputation Check",
    description: "Real-time verification against threat intelligence databases and reputation services",
    color: "safe"
  },
  {
    icon: AlertTriangle,
    title: "Red Flag Highlighting",
    description: "Automatically identifies and highlights suspicious elements in emails and websites",
    color: "danger"
  },
  {
    icon: Shield,
    title: "Security Scoring",
    description: "Comprehensive risk assessment with clear safety scores and actionable recommendations",
    color: "primary"
  },
  {
    icon: CheckCircle,
    title: "Real-time Protection",
    description: "Instant analysis and feedback to protect against emerging threats and attack vectors",
    color: "safe"
  }
];

export const SecurityFeatures = () => {
  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Advanced Security Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive fraud detection powered by cutting-edge AI and threat intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-glow transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:bg-${feature.color}/20 transition-colors`}>
                    <IconComponent className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Enterprise Ready</h3>
              </div>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Built for security teams and organizations that need robust protection against 
                sophisticated phishing campaigns and social engineering attacks.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-safe" />
                  <span>99.9% Accuracy Rate</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-safe" />
                  <span>Real-time Analysis</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-safe" />
                  <span>API Integration</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};