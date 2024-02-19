export const sendNotification = async (token, sendToAPIData) => {
  const url = 'https://fcm.googleapis.com/fcm/send';
  const headers = {
    Authorization:
      'key=AAAAjuMI6yE:APA91bFa1FD0_XbnkvoMpFNl7XoiDUS0RXfM0fKBRs9XAGqW9ab6uEnbYh5_UEbusq5KR-hfumhBwyg_rFhP484LQmqaJ9RrQyeFbHF1JYwToXWkAch4rb6u6RSo-6Sz1VAts-vo-dPQ',
    'Content-Type': 'application/json',
  };

  const data = {
    data: {},
    notification: {
      body: sendToAPIData,
      image: 'Sample text3',
    },
    android: {
      priority: 'hight',
    },
    to: token,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Process the response if needed
    const responseData = await response.json();
    console.log('Notification sent successfully:', responseData);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Call the function to send the notification
