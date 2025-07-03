'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface TestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
}

export default function ApiTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoints = [
    { name: 'Health Check', endpoint: '/health' },
    { name: 'Investment Plans', endpoint: '/plans' },
    { name: 'Users', endpoint: '/users' },
    { name: 'Investments', endpoint: '/investments' },
    { name: 'Transactions', endpoint: '/transactions' },
    { name: 'Wallets', endpoint: '/wallets' },
  ];

  const runTests = async () => {
    setIsLoading(true);
    setResults([]);

    for (const test of testEndpoints) {
      setResults(prev => [...prev, { endpoint: test.name, status: 'pending' }]);

      try {
        const response = await api.get(test.endpoint);
        setResults(prev => 
          prev.map(r => 
            r.endpoint === test.name 
              ? { endpoint: test.name, status: 'success', data: response.data }
              : r
          )
        );
      } catch (error: any) {
        setResults(prev => 
          prev.map(r => 
            r.endpoint === test.name 
              ? { 
                  endpoint: test.name, 
                  status: 'error', 
                  error: error.response?.data?.message || error.message 
                }
              : r
          )
        );
      }
    }

    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Connectivity Test</h1>
          <p className="text-muted-foreground">
            Test the connection between frontend and backend APIs
          </p>
        </div>
        <Button onClick={runTests} disabled={isLoading}>
          {isLoading ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{result.endpoint}</CardTitle>
                <Badge className={getStatusColor(result.status)}>
                  {result.status.toUpperCase()}
                </Badge>
              </div>
              <CardDescription>
                Testing endpoint: {testEndpoints.find(t => t.name === result.endpoint)?.endpoint}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.status === 'success' && (
                <div className="space-y-2">
                  <p className="text-sm text-green-600">✅ Success</p>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
              {result.status === 'error' && (
                <div className="space-y-2">
                  <p className="text-sm text-red-600">❌ Error</p>
                  <p className="text-sm">{result.error}</p>
                </div>
              )}
              {result.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-muted-foreground">Testing...</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Click "Run Tests" to start testing API connectivity
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 