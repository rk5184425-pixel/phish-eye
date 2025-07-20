import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';

const features = [
  {
    icon: 'brain',
    title: "AI-Powered Detection",
    description: "Advanced machine learning algorithms analyze patterns and detect sophisticated phishing attempts with 99.9% accuracy",
    color: "#10b981",
    gradient: ["#10b981", "#059669"]
  },
  {
    icon: 'eye',
    title: "Typosquatting Analysis",
    description: "Identifies domains that mimic legitimate services using character substitution, homograph attacks, and similar deception techniques",
    color: "#3b82f6",
    gradient: ["#3b82f6", "#1d4ed8"]
  },
  {
    icon: 'globe',
    title: "Real-time Threat Intel",
    description: "Continuous monitoring against global threat databases and reputation services for up-to-the-minute protection",
    color: "#8b5cf6",
    gradient: ["#8b5cf6", "#7c3aed"]
  },
  {
    icon: 'warning',
    title: "Smart Risk Assessment",
    description: "Automatically identifies and highlights suspicious elements with detailed explanations and actionable recommendations",
    color: "#f59e0b",
    gradient: ["#f59e0b", "#d97706"]
  },
  {
    icon: 'shield-checkmark',
    title: "Multi-Layer Security",
    description: "Comprehensive analysis including SSL verification, domain age checking, and behavioral pattern recognition",
    color: "#ef4444",
    gradient: ["#ef4444", "#dc2626"]
  },
  {
    icon: 'flash',
    title: "Instant Protection",
    description: "Real-time analysis and immediate feedback to protect against emerging threats and zero-day attack vectors",
    color: "#06b6d4",
    gradient: ["#06b6d4", "#0891b2"]
  }
];

const stats = [
  { number: "10M+", label: "Threats Blocked", icon: "shield-checkmark" },
  { number: "99.9%", label: "Accuracy Rate", icon: "analytics" },
  { number: "24/7", label: "Monitoring", icon: "time" },
  { number: "< 1s", label: "Analysis Time", icon: "flash" }
];

export function SecurityFeatures() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
          <Text style={styles.title}>Enterprise-Grade Security</Text>
          <Text style={styles.subtitle}>
            Powered by cutting-edge AI and real-time threat intelligence to provide 
            unmatched protection against sophisticated cyber threats
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Animated.View 
                key={index}
                entering={FadeInUp.delay(300 + index * 100)}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <Ionicons name={stat.icon as any} size={24} color="#10b981" />
                </View>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              entering={index % 2 === 0 ? FadeInLeft.delay(400 + index * 100) : FadeInRight.delay(400 + index * 100)}
            >
              <Card style={[styles.featureCard, { borderColor: `${feature.color}30` }]} animated delay={400 + index * 100}>
                <CardHeader>
                  <View style={styles.featureHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${feature.color}20` }]}>
                      <Ionicons name={feature.icon as any} size={28} color={feature.color} />
                    </View>
                    <CardTitle style={styles.featureTitle}>{feature.title}</CardTitle>
                  </View>
                </CardHeader>
                <CardContent>
                  <CardDescription style={styles.featureDescription}>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInUp.delay(1000)} style={styles.enterpriseSection}>
          <Card style={styles.enterpriseCard}>
            <CardContent style={styles.enterpriseContent}>
              <View style={styles.enterpriseHeader}>
                <View style={styles.enterpriseIconContainer}>
                  <Ionicons name="business" size={40} color="#10b981" />
                </View>
                <View style={styles.enterpriseHeaderText}>
                  <Text style={styles.enterpriseTitle}>Enterprise Ready</Text>
                  <Text style={styles.enterpriseSubtitle}>
                    Trusted by security teams worldwide
                  </Text>
                </View>
              </View>
              
              <Text style={styles.enterpriseDescription}>
                Built for organizations that demand the highest level of protection against 
                sophisticated phishing campaigns, social engineering attacks, and advanced persistent threats.
              </Text>
              
              <View style={styles.enterpriseFeatures}>
                <View style={styles.enterpriseFeaturesGrid}>
                  <View style={styles.enterpriseFeature}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    <Text style={styles.enterpriseFeatureText}>API Integration</Text>
                  </View>
                  <View style={styles.enterpriseFeature}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    <Text style={styles.enterpriseFeatureText}>Custom Rules</Text>
                  </View>
                  <View style={styles.enterpriseFeature}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    <Text style={styles.enterpriseFeatureText}>Bulk Analysis</Text>
                  </View>
                  <View style={styles.enterpriseFeature}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    <Text style={styles.enterpriseFeatureText}>Advanced Reporting</Text>
                  </View>
                  <View style={styles.enterpriseFeature}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    <Text style={styles.enterpriseFeatureText}>24/7 Support</Text>
                  </View>
                  <View style={styles.enterpriseFeature}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    <Text style={styles.enterpriseFeatureText}>SOC Integration</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.enterpriseButton}>
                <Text style={styles.enterpriseButtonText}>Learn More</Text>
                <Ionicons name="arrow-forward" size={20} color="#10b981" />
              </TouchableOpacity>
            </CardContent>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1200)} style={styles.trustSection}>
          <Text style={styles.trustTitle}>Trusted by Industry Leaders</Text>
          <View style={styles.trustLogos}>
            <View style={styles.trustLogo}>
              <Ionicons name="shield-checkmark" size={32} color="#6b7280" />
              <Text style={styles.trustLogoText}>Fortune 500</Text>
            </View>
            <View style={styles.trustLogo}>
              <Ionicons name="business" size={32} color="#6b7280" />
              <Text style={styles.trustLogoText}>Government</Text>
            </View>
            <View style={styles.trustLogo}>
              <Ionicons name="school" size={32} color="#6b7280" />
              <Text style={styles.trustLogoText}>Education</Text>
            </View>
            <View style={styles.trustLogo}>
              <Ionicons name="medical" size={32} color="#6b7280" />
              <Text style={styles.trustLogoText}>Healthcare</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    backgroundColor: '#0f172a',
  },
  content: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 20,
    color: '#f9fafb',
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#9ca3af',
    maxWidth: 700,
    textAlign: 'center',
    lineHeight: 26,
    fontSize: 18,
  },
  statsSection: {
    marginBottom: 60,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
    textAlign: 'center',
  },
  featuresGrid: {
    gap: 24,
    marginBottom: 80,
  },
  featureCard: {
    backgroundColor: '#1a2332',
    borderWidth: 1,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 20,
    flex: 1,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 24,
  },
  enterpriseSection: {
    marginBottom: 60,
  },
  enterpriseCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 2,
  },
  enterpriseContent: {
    padding: 32,
  },
  enterpriseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  enterpriseIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  enterpriseHeaderText: {
    flex: 1,
  },
  enterpriseTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f9fafb',
    marginBottom: 4,
  },
  enterpriseSubtitle: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
  enterpriseDescription: {
    color: '#d1d5db',
    marginBottom: 32,
    fontSize: 16,
    lineHeight: 26,
  },
  enterpriseFeatures: {
    marginBottom: 32,
  },
  enterpriseFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  enterpriseFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: '45%',
    marginBottom: 8,
  },
  enterpriseFeatureText: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '500',
  },
  enterpriseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  enterpriseButtonText: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: '600',
  },
  trustSection: {
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 32,
    textAlign: 'center',
  },
  trustLogos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 32,
  },
  trustLogo: {
    alignItems: 'center',
    gap: 8,
    opacity: 0.7,
  },
  trustLogoText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
});