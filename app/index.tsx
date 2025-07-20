import React from 'react';
import { ScrollView, View } from 'react-native';
import { FraudAnalyzer } from '../components/FraudAnalyzer';
import { SecurityFeatures } from '../components/SecurityFeatures';

export default function Index() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1">
        <FraudAnalyzer />
        <SecurityFeatures />
      </View>
    </ScrollView>
  );
}