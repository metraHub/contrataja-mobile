import React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard, Text } from 'react-native-paper';

interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  right?: () => React.ReactNode;
}

export default function Card({ title, subtitle, description, onPress, children, right }: CardProps) {
  return (
    <PaperCard style={styles.card} onPress={onPress}>
      <PaperCard.Title title={title} subtitle={subtitle} right={right ? () => right() : undefined} />
      {description && (
        <PaperCard.Content>
          <Text variant="bodyMedium">{description}</Text>
        </PaperCard.Content>
      )}
      {children && <PaperCard.Content>{children}</PaperCard.Content>}
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 2,
    backgroundColor: '#fff',
    elevation: 2,
  },
});
