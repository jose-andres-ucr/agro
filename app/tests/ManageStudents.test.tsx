import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ManageStudents from '@/path/to/ManageStudents';

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: jest.fn(() => ({
            students: [],
          })),
        }),
        update: jest.fn(),
      })),
    })),
  }),
  firestore: () => ({
    FieldValue: {
      arrayUnion: jest.fn(),
      arrayRemove: jest.fn(),
    },
  }),
}));

describe('ManageStudents', () => {
  it('should render the component correctly', async () => {
    render(<ManageStudents />);
    expect(screen.getByText('Lista de Estudiantes Matriculados en el grupo')).toBeTruthy();
    expect(screen.getByText('Agregar Estudiante')).toBeTruthy();
  });

  it('should add a student', async () => {
    render(<ManageStudents />);

    const input = screen.getByPlaceholderText('Correo del estudiante');
    fireEvent.changeText(input, 'test@student.com');

    const button = screen.getByText('Agregar Estudiante');
    fireEvent.press(button);

    // Simulate adding a student
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for async operations

    expect(screen.getByText('test@student.com')).toBeTruthy();
  });

  it('should remove a student', async () => {
    render(<ManageStudents />);

    const removeButton = screen.getByText('Eliminar');
    fireEvent.press(removeButton);

    // Simulate removing a student
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for async operations

    expect(screen.queryByText('test@student.com')).toBeNull();
  });

  it('should not add duplicate students', async () => {
    render(<ManageStudents />);

    const input = screen.getByPlaceholderText('Correo del estudiante');
    fireEvent.changeText(input, 'test@student.com');

    const button = screen.getByText('Agregar Estudiante');
    fireEvent.press(button);

    // Simulate adding a student
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for async operations

    // Try to add the same student again
    fireEvent.changeText(input, 'test@student.com');
    fireEvent.press(button);

    // Simulate adding a student again
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for async operations

    const allEmails = screen.getAllByText('test@student.com');
    expect(allEmails.length).toBe(1); // Should only be one instance of the email
   });

   it('should show autocomplete suggestions when typing email', async () => {
    render(<ManageStudents />);

    const input = screen.getByPlaceholderText('Correo del estudiante');
    fireEvent.changeText(input, 'test');

    // Simulate waiting for autocomplete suggestions
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for async operations

    // Verify that suggestions appear
    const suggestions = screen.getAllByText(/test/);
    expect(suggestions.length).toBeGreaterThan(0); // There should be some suggestions
   });
});
