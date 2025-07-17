import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { mockChallenges, formatCurrency } from '../mock/mockData';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Calendar, 
  DollarSign,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const CreateChallenge = () => {
  const navigate = useNavigate();
  const { user, updateBalance } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    rules: '',
    mediaUrl: '',
    budget: '',
    rewardRate: '',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const totalSteps = 4;
  const categories = ['Fashion', 'Technology', 'Fitness', 'Food', 'Travel', 'Lifestyle', 'Entertainment'];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const stepErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) stepErrors.title = 'Title is required';
        if (!formData.description.trim()) stepErrors.description = 'Description is required';
        if (!formData.category) stepErrors.category = 'Category is required';
        break;
      
      case 2:
        if (!formData.mediaUrl.trim()) stepErrors.mediaUrl = 'Media URL is required';
        if (!formData.rules.trim()) stepErrors.rules = 'Rules are required';
        break;
      
      case 3:
        if (!formData.budget || parseFloat(formData.budget) <= 0) {
          stepErrors.budget = 'Budget must be greater than 0';
        }
        if (!formData.rewardRate || parseFloat(formData.rewardRate) <= 0) {
          stepErrors.rewardRate = 'Reward rate must be greater than 0';
        }
        if (parseFloat(formData.budget) > user.balance) {
          stepErrors.budget = 'Insufficient balance';
        }
        break;
      
      case 4:
        if (!formData.startDate) stepErrors.startDate = 'Start date is required';
        if (!formData.endDate) stepErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate) {
          const start = new Date(formData.startDate);
          const end = new Date(formData.endDate);
          if (start >= end) {
            stepErrors.endDate = 'End date must be after start date';
          }
          if (start < new Date()) {
            stepErrors.startDate = 'Start date cannot be in the past';
          }
        }
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        setPreviewMode(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Mock challenge creation
      const newChallenge = {
        id: `${Date.now()}`,
        ...formData,
        budget: parseFloat(formData.budget),
        budgetUsed: 0,
        rewardRate: parseFloat(formData.rewardRate),
        status: 'active',
        creatorId: user.id,
        creatorName: user.name,
        participantCount: 0,
        submissionCount: 0
      };

      // Add to mock data
      mockChallenges.push(newChallenge);
      
      // Update user balance
      const newBalance = user.balance - parseFloat(formData.budget);
      updateBalance(newBalance, user.payoutBalance);
      
      // Redirect to challenge detail
      navigate(`/challenge/${newChallenge.id}`);
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-600">Tell us about your challenge</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Challenge Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Fashion Challenge"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your challenge and what participants need to do..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={errors.description ? 'border-red-500' : ''}
                  rows={4}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Media & Rules</h2>
              <p className="text-gray-600">Add visual content and set the rules</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="mediaUrl">Challenge Image URL *</Label>
                <div className="relative">
                  <Input
                    id="mediaUrl"
                    placeholder="https://example.com/image.jpg"
                    value={formData.mediaUrl}
                    onChange={(e) => handleInputChange('mediaUrl', e.target.value)}
                    className={errors.mediaUrl ? 'border-red-500' : ''}
                  />
                  <Upload className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.mediaUrl && <p className="text-red-500 text-sm mt-1">{errors.mediaUrl}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  Tip: Use high-quality images from Unsplash or similar services
                </p>
              </div>
              
              {formData.mediaUrl && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img 
                      src={formData.mediaUrl} 
                      alt="Challenge preview" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="rules">Challenge Rules *</Label>
                <Textarea
                  id="rules"
                  placeholder="e.g., Must include #YourHashtag, minimum 30 seconds video, original content only..."
                  value={formData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  className={errors.rules ? 'border-red-500' : ''}
                  rows={4}
                />
                {errors.rules && <p className="text-red-500 text-sm mt-1">{errors.rules}</p>}
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget & Rewards</h2>
              <p className="text-gray-600">Set your budget and reward structure</p>
            </div>
            
            <Alert className="border-blue-200 bg-blue-50">
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                Your current balance: <strong>{formatCurrency(user.balance)}</strong>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="budget">Total Budget *</Label>
                <div className="relative">
                  <Input
                    id="budget"
                    type="number"
                    placeholder="1000000"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className={errors.budget ? 'border-red-500' : ''}
                  />
                  <span className="absolute right-3 top-3 text-gray-400 text-sm">IDR</span>
                </div>
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
              </div>
              
              <div>
                <Label htmlFor="rewardRate">Reward Rate (per 1,000 views) *</Label>
                <div className="relative">
                  <Input
                    id="rewardRate"
                    type="number"
                    placeholder="1000"
                    value={formData.rewardRate}
                    onChange={(e) => handleInputChange('rewardRate', e.target.value)}
                    className={errors.rewardRate ? 'border-red-500' : ''}
                  />
                  <span className="absolute right-3 top-3 text-gray-400 text-sm">IDR</span>
                </div>
                {errors.rewardRate && <p className="text-red-500 text-sm mt-1">{errors.rewardRate}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  Participants earn this amount for every 1,000 views their video gets
                </p>
              </div>
              
              {formData.budget && formData.rewardRate && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Reward Calculation</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Maximum possible views: {Math.floor(parseFloat(formData.budget) / parseFloat(formData.rewardRate || 1)).toLocaleString()}K</p>
                    <p>Estimated participants: {Math.floor(Math.floor(parseFloat(formData.budget) / parseFloat(formData.rewardRate || 1)) / 10)} (assuming 10K views each)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Timeline</h2>
              <p className="text-gray-600">Set when your challenge starts and ends</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
              
              {formData.startDate && formData.endDate && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Challenge Duration</h4>
                  <p className="text-sm text-gray-600">
                    {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Challenge</h2>
        <p className="text-gray-600">Review your challenge before publishing</p>
      </div>
      
      <Card>
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={formData.mediaUrl}
            alt={formData.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </div>
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{formData.title}</CardTitle>
            <Badge variant="outline">{formData.category}</Badge>
          </div>
          <p className="text-gray-600">{formData.description}</p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Budget:</span>
                <span className="ml-2 font-semibold text-green-600">
                  {formatCurrency(parseFloat(formData.budget))}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Reward Rate:</span>
                <span className="ml-2 font-semibold">
                  {formatCurrency(parseFloat(formData.rewardRate))}/1K views
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Rules</h4>
              <p className="text-sm text-gray-600">{formData.rules}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Challenge</h1>
            <p className="text-gray-600">Share your ideas and inspire content creators</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-8">
            {previewMode ? renderPreview() : renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={previewMode ? () => setPreviewMode(false) : handlePrevious}
            disabled={currentStep === 1 && !previewMode}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Previous'}
          </Button>
          
          <Button
            onClick={previewMode ? handleSubmit : handleNext}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? 'Publishing...' : previewMode ? 'Publish Challenge' : 'Next'}
            {!previewMode && <ArrowRight className="h-4 w-4 ml-2" />}
            {previewMode && <CheckCircle className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateChallenge;