import React, { useState } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput, IconButton, Text } from 'react-native-paper';
import Loading from '../../../../components/common/Loading';
import useChat from './useChat';
import styles from './styles';
import { spacing } from '../../../../theme/colors';
import { formatSalary } from '../../../../shared';

export default function Chat({ route }: any) {
  const { roomId, jobCallId } = route.params;
  const { messages, isLoading, currentUserId, flatListRef, handleSend, scrollToBottom, jobCall } =
    useChat(roomId, jobCallId);
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const onSend = () => {
    if (!text.trim()) return;
    handleSend(text);
    setText('');
  };

  if (isLoading && messages.length === 0) {
    return <Loading message="Carregando mensagens..." />;
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {jobCall && (
        <View style={styles.jobHeader}>
          <Text style={styles.jobHeaderTitle} numberOfLines={1}>
            {jobCall.title}
          </Text>
          {jobCall.company?.companyName ? (
            <Text style={styles.jobHeaderCompany} numberOfLines={1}>
              {jobCall.company.companyName}
            </Text>
          ) : null}
          <Text style={styles.jobHeaderSalary}>{formatSalary(jobCall.salary, jobCall.salaryMax)}</Text>
          <Text style={styles.jobHeaderDescription} numberOfLines={2}>
            {jobCall.description}
          </Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={scrollToBottom}
        renderItem={({ item }) => {
          const isMine = item.senderId === currentUserId;
          return (
            <View
              style={[
                styles.bubbleRow,
                isMine ? styles.myBubbleRow : styles.otherBubbleRow,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isMine ? styles.myBubble : styles.otherBubble,
                ]}
              >
                <Text style={isMine ? styles.myText : styles.otherText}>
                  {item.content}
                </Text>
                <Text
                  style={[
                    styles.time,
                    isMine ? styles.myTime : styles.otherTime,
                  ]}
                >
                  {formatTime(item.createdAt)}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
        }
      />

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Digite sua mensagem..."
          mode="outlined"
          style={styles.input}
          dense
          onSubmitEditing={onSend}
          returnKeyType="send"
        />
        <IconButton icon="send" mode="contained" onPress={onSend} />
      </View>
    </KeyboardAvoidingView>
  );
}
