'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TestPage() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testApi = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/v1/health');
      const data = await response.json();
      setResults({ success: true, data });
    } catch (error: any) {
      setResults({ success: false, error: error.message });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Simple API Test</h1>
          <p className="text-muted-foreground">
            Test basic frontend-backend connectivity
          </p>
        </div>
        <Button onClick={testApi} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test API'}
        </Button>
      </div>

      {results && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>API Test Results</CardTitle>
              <Badge className={results.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {results.success ? 'SUCCESS' : 'ERROR'}
              </Badge>
            </div>
            <CardDescription>
              Testing connection to backend API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 