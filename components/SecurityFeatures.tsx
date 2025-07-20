import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Advanced Security Features</Text>
          <Text style={styles.subtitle}>
            Comprehensive fraud detection powered by cutting-edge AI and threat intelligence
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard}>
              <CardHeader>
                <View style={styles.iconContainer}>
                  <Ionicons name={feature.icon as any} size={24} color={feature.color} />
                </View>
                <CardTitle style={styles.featureTitle}>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription style={styles.featureDescription}>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </View>

        <View style={styles.enterpriseSection}>
          <Card style={styles.enterpriseCard}>
            <CardContent style={styles.enterpriseContent}>
              <View style={styles.enterpriseHeader}>
                <Ionicons name="shield" size={32} color="#22c55e" />
                <Text style={styles.enterpriseTitle}>Enterprise Ready</Text>
              </View>
              <Text style={styles.enterpriseDescription}>
                Built for security teams and organizations that need robust protection against 
                sophisticated phishing campaigns and social engineering attacks.
              </Text>
              <View style={styles.enterpriseFeatures}>
                <View style={styles.enterpriseFeature}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={styles.enterpriseFeatureText}>99.9% Accuracy Rate</Text>
                </View>
                <View style={styles.enterpriseFeature}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={styles.enterpriseFeatureText}>Real-time Analysis</Text>
                </View>
                <View style={styles.enterpriseFeature}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={styles.enterpriseFeatureText}>API Integration</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
    paddingHorizontal: 16,
    backgroundColor: '#0f172a',
  },
  content: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#f1f5f9',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    maxWidth: 600,
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresGrid: {
    gap: 24,
  },
  featureCard: {
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  enterpriseSection: {
    marginTop: 64,
  },
  enterpriseCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  enterpriseContent: {
    paddingTop: 24,
  },
  enterpriseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  enterpriseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  enterpriseDescription: {
    color: '#94a3b8',
    marginBottom: 24,
    maxWidth: 600,
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 20,
  },
  enterpriseFeatures: {
    gap: 24,
    alignItems: 'center',
  },
  enterpriseFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  enterpriseFeatureText: {
    color: '#f1f5f9',
  },
});