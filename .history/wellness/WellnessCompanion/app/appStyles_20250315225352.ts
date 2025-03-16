// appStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  contentContainer: {
    paddingBottom: 40, // 避免键盘或滚动到底部的布局问题
  },

  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },

  sectionContainer: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },

  iconButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },

  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },

  selectedTag: {
    backgroundColor: '#007AFF1A', // 浅色背景
    borderColor: '#007AFF',
  },

  tagText: {
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
  },

  slider: {
    marginVertical: 10,
  },

  sliderLabel: {
    marginTop: 8,
  },

  messageText: {
    marginVertical: 16,
    fontSize: 16,
    lineHeight: 22,
  },
});
