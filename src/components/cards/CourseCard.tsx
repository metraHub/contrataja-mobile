import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onPress?: () => void;
}

export default function CourseCard({ course, onPress }: CourseCardProps) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Title
        title={course.title}
        subtitle={course.institution?.institutionName}
      />
      <Card.Content>
        <Text variant="bodyMedium" numberOfLines={2}>
          {course.description}
        </Text>
        <Chip style={styles.chip}>
          {course.category} - {course.duration}
        </Chip>
        <Text variant="titleMedium" style={styles.price}>
          R$ {course.price.toFixed(2)}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 2,
    backgroundColor: '#fff',
    elevation: 2,
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#f3e5f5',
  },
  price: {
    marginTop: 8,
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
