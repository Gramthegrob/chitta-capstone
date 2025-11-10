import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';

// Dummy history per tanggal
const dummyHistory = {
  '2025-11-06': [
    { id: '1', text: 'Halo!', isUser: true, timestamp: new Date('2025-11-06T10:00:00') },
    { id: '2', text: 'Ada yang bisa dibantu hari ini?', isUser: false, timestamp: new Date('2025-11-06T10:01:00') },
  ],
  '2025-11-05': [
    { id: '3', text: 'Apa kabar?', isUser: true, timestamp: new Date('2025-11-05T09:00:00') },
    { id: '4', text: 'Saya baik!', isUser: false, timestamp: new Date('2025-11-05T09:01:00') },
  ],
};

const KonsultasiScreen = () => {
  const [messages, setMessages] = useState([
    { id: 'ai-initial', text: 'Halo! Aku di sini untuk mendengarkan dan membantu Anda. Ada yang ingin Anda bicarakan tentang kesehatan mental Anda?', isUser: false, timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(dummyHistory);
  const [selectedDate, setSelectedDate] = useState(null);
  const flatListRef = useRef(null);
  const [apiError, setApiError] = useState(null);

  // Konversi messages ke format conversation history untuk API
  const getConversationHistory = () => {
    return messages
      .filter(msg => msg.id !== 'ai-initial')
      .map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));
  };

  // Call backend API untuk mendapatkan AI response
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { 
      id: Date.now().toString(), 
      text: inputText, 
      isUser: true, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setApiError(null);

    try {
      // Dapatkan conversation history
      const conversationHistory = getConversationHistory();
      
      console.log('📨 Sending message:', userMessage.text);
      console.log('📋 Conversation history:', conversationHistory);
      
      // Call backend API
      const response = await fetch('http://localhost:8080/api/konsultasi/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: conversationHistory
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ AI Response:', data.response);
      
      const aiResponseText = data.response;
      
      const aiMessage = { 
        id: (Date.now() + 1).toString(), 
        text: aiResponseText, 
        isUser: false, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, aiMessage]);
      flatListRef.current?.scrollToEnd({ animated: true });

      // Simpan ke history per tanggal
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      setHistory(prev => {
        const todayMessages = prev[today] 
          ? [...prev[today], userMessage, aiMessage] 
          : [userMessage, aiMessage];
        return { ...prev, [today]: todayMessages };
      });
    } catch (error) {
      console.error('❌ Error calling backend API:', error);
      setApiError(error.message);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: `Maaf, terjadi kesalahan: ${error.message}. Pastikan backend sudah running di port 3000.`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.aiMessage]}>
      <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>{item.timestamp.toLocaleTimeString()}</Text>
    </View>
  );

  // Render chat per tanggal di riwayat
  const renderHistoryMessages = () => {
    if (!selectedDate || !history[selectedDate] || history[selectedDate].length === 0) {
      return <Text style={styles.noHistory}>Belum ada pesan pada tanggal ini</Text>;
    }
    return (
      <FlatList
        data={history[selectedDate]}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
    >
      {/* Modal Riwayat */}
      <Modal visible={showHistory} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Riwayat Chat</Text>
          <FlatList
            data={Object.keys(history).sort((a, b) => b.localeCompare(a))} // urut dari terbaru
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedDate(item)} style={styles.dateButton}>
                <Text style={styles.dateText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={{ flex: 1, marginTop: 10 }}>
            {selectedDate && renderHistoryMessages()}
          </View>
          <TouchableOpacity onPress={() => setShowHistory(false)} style={styles.closeButton}>
            <Text style={styles.closeText}>Tutup Riwayat</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Chat utama */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#534DD9" />
          <Text style={styles.loadingText}>AI sedang berpikir...</Text>
        </View>
      )}

      {apiError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {apiError}</Text>
        </View>
      )}

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ketik pesan Anda..."
            multiline
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>Kirim</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>Konsultasi kesehatan mental dengan AI</Text>
        <TouchableOpacity onPress={() => setShowHistory(true)}>
          <Text style={[styles.infoText, { color: '#534DD9', marginTop: 5 }]}>Lihat Riwayat Chat</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messageContainer: { marginVertical: 5, padding: 10, borderRadius: 10, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#534DD9' },
  aiMessage: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  messageText: { fontSize: 16, marginBottom: 5 },
  userText: { color: '#fff' },
  aiText: { color: '#000' },
  timestamp: { fontSize: 12, color: '#999', alignSelf: 'flex-end' },
  loadingContainer: { alignItems: 'center', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd' },
  loadingText: { marginTop: 5, color: '#666' },
  errorContainer: { padding: 10, backgroundColor: '#FFE9E9', borderTopWidth: 1, borderTopColor: '#FF6B6B' },
  errorText: { color: '#C92A2A', fontSize: 14 },
  inputWrapper: { paddingHorizontal: 10, paddingVertical: 10, paddingBottom: 35, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd' },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 15, paddingVertical: Platform.OS === 'ios' ? 12 : 8, fontSize: 16 },
  sendButton: { backgroundColor: '#534DD9', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, justifyContent: 'center', marginLeft: 10 },
  sendButtonDisabled: { backgroundColor: '#B8B0D9', opacity: 0.6 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  infoText: { marginTop: 4, fontSize: 12, color: '#888', textAlign: 'center' },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  dateButton: { padding: 10, backgroundColor: '#E9E8FF', marginVertical: 4, borderRadius: 10 },
  dateText: { color: '#041062', fontWeight: '600' },
  closeButton: { marginTop: 20, alignSelf: 'center' },
  closeText: { color: '#534DD9', fontWeight: 'bold' },
  noHistory: { marginTop: 20, textAlign: 'center', fontStyle: 'italic', color: '#888' },
});

export default KonsultasiScreen;