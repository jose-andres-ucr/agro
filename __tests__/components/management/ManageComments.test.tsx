import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ManageComments from '@/app/components/management/ManageComments';
import { configureMocksForRole } from '../../utilityMocks';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

jest.mock('@react-native-firebase/firestore', () => ({
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  onSnapshot: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('react-native-sound', () => {
  return jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    stop: jest.fn(),
    release: jest.fn(),
  }));
});

const mockCollectionData = [
  {
    id: '1',
    Attachment: ['https://example.com/sample.jpg'],
    Name: 'Test',
    DateTime: {
      toDate: () => new Date(),
      toMillis: () => new Date().getTime(),
    },
    Comment: 'Sample comment',
    UserId: 'user1',
    Response: 'Sample response',
    Hide: false,
  },
];

firestore.collection().onSnapshot.mockImplementation((callback) => {
  callback({
    forEach: (fn: (doc: any) => void) =>
      mockCollectionData.forEach((data) => fn({ id: data.id, data: () => data })),
  });
});

describe('ManageComments Component', () => {
  beforeEach(() => {
    configureMocksForRole('Administrador');
  });

  it('hide comment', async () => {
    const { getByText, getAllByText } = render(<ManageComments />);
    await waitFor(() => {
      expect(getByText('Test')).toBeTruthy();
    });

    const hideButtons = getAllByText('Ocultar');
    fireEvent.press(hideButtons[0]);

    await waitFor(() => {
      expect(firestore.collection().doc().update).toHaveBeenCalledWith({
        Hide: true,
      });
    });
  });

  it('delete comment', async () => {
    const { getByText, getAllByText } = render(<ManageComments />);
    await waitFor(() => {
      expect(getByText('Test')).toBeTruthy();
    });

    const deleteButtons = getAllByText('Eliminar');
    fireEvent.press(deleteButtons[0]);

    const confirmDeleteButton = getByText('Eliminar');
    fireEvent.press(confirmDeleteButton);

    await waitFor(() => {
      expect(firestore.collection().doc().delete).toHaveBeenCalled();
    });
  });
});
