import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, TrendingUp, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: "Connect Donors",
      description: "Match surplus resources with those who need them most"
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Matching",
      description: "Smart algorithms optimize distribution and reduce waste"
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Track your contribution and see real-time impact metrics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by AI & Blockchain</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Turning Urban Surplus into Shared Smiles
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the intelligent network connecting donors, NGOs, and logistics partners 
            to redistribute surplus food, clothing, books, and more to those who need them.
          </p>
          
          <Button 
            size="lg" 
            className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate("/select-role")}
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Problem & Solution Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-24 grid md:grid-cols-2 gap-12"
        >
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <h2 className="text-3xl font-bold mb-4 text-destructive">The Problem</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every day, tons of surplus food, clothing, and essential items go to waste in urban areas, 
              while many people struggle to access basic necessities. The disconnect between abundance 
              and need creates both environmental and social challenges.
            </p>
          </div>
          
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <h2 className="text-3xl font-bold mb-4 text-success">Our Solution</h2>
            <p className="text-muted-foreground leading-relaxed">
              We've built an intelligent platform that bridges this gap using AI-powered matching, 
              blockchain verification, and optimized logistics. Connect surplus with need efficiently, 
              transparently, and sustainably.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
