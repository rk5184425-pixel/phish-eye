import { FraudAnalyzer } from '@/components/FraudAnalyzer';
import { SecurityFeatures } from '@/components/SecurityFeatures';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FraudAnalyzer />
      <SecurityFeatures />
    </div>
  );
};

export default Index;
