'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StyleTransfer } from '@/components/StyleTransfer';
import { CombineStyles } from '@/components/CombineStyles';
import { useStyleTransfer, StyleModelType, TransformerModelType } from '@/hooks/useStyleTransfer';
import { Github, Palette, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { FloatingOrbs } from '@/components/floating-orbs';

export default function Home() {
  const {
    isLoading,
    error,
    loadModels,
    stylizeImage,
    combineStyles,
    progress,
  } = useStyleTransfer();

  const [styleModel, setStyleModel] = useState<StyleModelType>('mobilenet');
  const [transformerModel, setTransformerModel] = useState<TransformerModelType>('separable');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStyleModelChange = (value: string) => {
    const newValue = value as StyleModelType;
    setStyleModel(newValue);
    loadModels(newValue, transformerModel);
  };

  const handleTransformerModelChange = (value: string) => {
    const newValue = value as TransformerModelType;
    setTransformerModel(newValue);
    loadModels(styleModel, newValue);
  };

  const handleStylize = async (
    contentImg: HTMLImageElement,
    styleImg: HTMLImageElement,
    styleRatio: number
  ) => {
    setIsProcessing(true);
    try {
      return await stylizeImage(contentImg, styleImg, styleRatio);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCombine = async (
    contentImg: HTMLImageElement,
    styleImg1: HTMLImageElement,
    styleImg2: HTMLImageElement,
    combinationRatio: number
  ) => {
    setIsProcessing(true);
    try {
      return await combineStyles(contentImg, styleImg1, styleImg2, combinationRatio);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 relative overflow-hidden">
      <FloatingOrbs />
      
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-2 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg"
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Arbitrary Style Transfer</h1>
                <p className="text-sm text-muted-foreground">Powered by TensorFlow.js</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a
                href="https://github.com/shivbera18/arbitrary-style-transfer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">View on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
          <Alert className="mb-6 bg-primary/10 border-primary/20">
            <AlertDescription className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              Loading models... Please wait.
            </AlertDescription>
          </Alert>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          <Tabs defaultValue="stylize" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="stylize">Stylize an Image</TabsTrigger>
              <TabsTrigger value="combine">Combine Two Styles</TabsTrigger>
            </TabsList>

            <TabsContent value="stylize" className="space-y-6">
              <StyleTransfer
                onStylize={handleStylize}
                isProcessing={isProcessing}
                progress={progress}
              />
            </TabsContent>

            <TabsContent value="combine" className="space-y-6">
              <CombineStyles
                onCombine={handleCombine}
                isProcessing={isProcessing}
                progress={progress}
              />
            </TabsContent>
          </Tabs>

          {/* Model Selection */}
          <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle>Model Settings</CardTitle>
              <CardDescription>
                Choose different models for speed vs quality tradeoffs
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Style Network</label>
                <Select value={styleModel} onValueChange={handleStyleModelChange}>
                  <SelectTrigger disabled={isLoading || isProcessing}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobilenet">
                      [Fast] MobileNet (9.6MB)
                    </SelectItem>
                    <SelectItem value="inception">
                      [Quality] Inception v3 (36.3MB)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Transformer Network</label>
                <Select value={transformerModel} onValueChange={handleTransformerModelChange}>
                  <SelectTrigger disabled={isLoading || isProcessing}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="separable">
                      [Fast] Separable Conv (2.4MB)
                    </SelectItem>
                    <SelectItem value="original">
                      [Quality] Original (7.9MB)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle>About This Demo</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                This is an implementation of arbitrary style transfer running entirely in your
                browser using TensorFlow.js. The neural network attempts to &quot;draw&quot; one picture
                (the content) in the style of another (the style).
              </p>
              <p>
                Unlike traditional style transfer implementations that require a separate neural
                network for each style, this uses a <strong>style network</strong> that breaks
                down any image into a 100-dimensional style vector. This vector is then fed into
                a <strong>transformer network</strong> along with the content image to produce
                the final stylized result.
              </p>
              <h3 className="text-lg font-semibold mt-4">Privacy & Security</h3>
              <p>
                All processing happens locally in your browser. Your images never leave your
                computer - we send you the models and code to run them, not the other way around!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Based on the{' '}
            <a
              href="https://arxiv.org/abs/1705.06830"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Arbitrary Style Transfer
            </a>{' '}
            paper
          </p>
        </div>
      </footer>
    </main>
  );
}
