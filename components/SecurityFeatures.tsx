import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';

const features = [
  {
    icon: 'brain',
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms detect sophisticated phishing attempts and fraud patterns",
    color: "#22c55e"
  },
  {
    icon: 'eye',
    title: "Typosquatting Detection",
    description: "Identifies domains that mimic legitimate services using character substitution and similar tricks",
    color: "#f59e0b"
  },
  {
    icon: 'globe',
    title: "Domain Reputation Check",
    description: "Real-time verification against threat intelligence databases and reputation services",
    color: "#22c55e"
  },
  {
    icon: 'warning',
    title: "Red Flag Highlighting",
    description: "Automatically identifies and highlights suspicious elements in emails and websites",
    color: "#ef4444"
  },
  {
    icon: 'shield',
    title: "Security Scoring",
    description: "Comprehensive risk assessment with clear safety scores and actionable recommendations",
    color: "#22c55e"
  },
  {
    icon: 'checkmark-circle',
    title: "Real-time Protection",
    description: "Instant analysis and feedback to protect against emerging threats and attack vectors",
    color: "#22c55e"
  }
];

export function SecurityFeatures() {
  return (
    <View className="py-16 px-4">
      <View className="max-w-6xl mx-auto">
        <View className="text-center mb-12">
          <Text className="text-3xl font-bold mb-4 text-foreground">Advanced Security Features</Text>
          <Text className="text-muted-foreground max-w-2xl mx-auto text-center">
            Comprehensive fraud detection powered by cutting-edge AI and threat intelligence
          </Text>
        </View>

        <View className="grid grid-cols-1 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50">
              <CardHeader>
                <View className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Ionicons name={feature.icon as any} size={24} color={feature.color} />
                </View>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </View>

        <View className="mt-16">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <View className="flex-row items-center justify-center space-x-3 mb-4">
                <Ionicons name="shield" size={32} color="#22c55e" />
                <Text className="text-2xl font-bold text-foreground">Enterprise Ready</Text>
              </View>
              <Text className="text-muted-foreground mb-6 max-w-2xl mx-auto text-center">
                Built for security teams and organizations that need robust protection against 
                sophisticated phishing campaigns and social engineering attacks.
              </Text>
              <View className="grid grid-cols-1 gap-6 text-sm">
                <View className="flex-row items-center justify-center space-x-2">
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text className="text-foreground">99.9% Accuracy Rate</Text>
                </View>
                <View className="flex-row items-center justify-center space-x-2">
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text className="text-foreground">Real-time Analysis</Text>
                </View>
                <View className="flex-row items-center justify-center space-x-2">
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text className="text-foreground">API Integration</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </View>
  );
}