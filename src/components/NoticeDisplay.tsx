'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { api, endpoints } from '@/lib/api';

interface Notice {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NoticeDisplay() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchActiveNotice();
  }, []);

  const fetchActiveNotice = async () => {
    try {
      const response = await api.get(endpoints.notices.active);
      if (response.data) {
        setNotice(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch active notice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Store dismissal in localStorage to prevent showing again in this session
    localStorage.setItem('notice_dismissed', notice?._id || '');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  // Don't show if loading, no notice, or dismissed
  if (loading || !notice || dismissed) {
    return null;
  }

  // Check if this notice was already dismissed in this session
  const dismissedNoticeId = localStorage.getItem('notice_dismissed');
  if (dismissedNoticeId === notice._id) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Card className="border-2 overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <BellIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{notice.title}</span>
                    <Badge className={getTypeColor(notice.type)}>
                      {getTypeIcon(notice.type)} {notice.type}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-500">Platform Announcement</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{notice.message}</p>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Posted on {new Date(notice.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
} 