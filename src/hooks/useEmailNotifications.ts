import { supabase } from '@/integrations/supabase/client';

export interface NotificationData {
  type: 'event' | 'blog' | 'ministry' | 'sermon';
  title: string;
  description?: string;
  content_id: string;
  author_name?: string;
  event_date?: string;
  preacher_name?: string;
}

export const useEmailNotifications = () => {
  const sendNotification = async (data: NotificationData) => {
    try {
      console.log('Sending email notification:', data);
      
      const { data: result, error } = await supabase.functions.invoke('send-notification-emails', {
        body: data,
      });

      if (error) {
        console.error('Error sending notification:', error);
        throw error;
      }

      console.log('Notification sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      throw error;
    }
  };

  return { sendNotification };
};