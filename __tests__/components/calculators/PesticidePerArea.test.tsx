import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PesticidePerArea from '@/app/components/calculators/PesticidePerArea';
import { UserContext } from '@/app/hooks/context/UserContext';
import { configureMocksForRole } from '../../utilityMocks';

describe('PesticidePerArea', () => {
  it('calculates PesticidePerArea result', async () => {
    const userContextValue = configureMocksForRole('Administrador');

    const { getByLabelText, getByText, getByDisplayValue } = render(
      <UserContext.Provider value={userContextValue}>
        <PesticidePerArea />
      </UserContext.Provider>
    );

    fireEvent.changeText(getByLabelText('Área aplicada'), '100');
    fireEvent.changeText(getByLabelText('Volumen inicial'), '200');
    fireEvent.changeText(getByLabelText('Volumen final'), '150');
    fireEvent.changeText(getByLabelText('Area por aplicar'), '50');

    fireEvent.press(getByText('Calcular'));

    await waitFor(() => {
      expect(getByDisplayValue('25.000')).toBeTruthy();
    });
  });
});
