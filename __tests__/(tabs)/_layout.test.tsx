import React from 'react';
import { render } from '@testing-library/react-native';
import TabLayout from '@/app/(tabs)/_layout';
import { UserContext } from '@/app/hooks/context/UserContext';
import { configureMocksForRole } from '../utilityMocks';

describe('TabLayout', () => {
  it('renders for Administrador', () => {
    const userContextValue = configureMocksForRole('Administrador');
    const { getByText } = render(
      <UserContext.Provider value={userContextValue}>
        <TabLayout />
      </UserContext.Provider>
    );

    expect(getByText('Herbicidas')).toBeTruthy();
    expect(getByText('Fungicidas e Insecticidas')).toBeTruthy();
    expect(getByText('Sección Informativa')).toBeTruthy();
    expect(getByText('Entorno Educativo')).toBeTruthy();
    expect(getByText('Administrar Material')).toBeTruthy();
    expect(getByText('Aprobación de Registro')).toBeTruthy();
    expect(getByText('Administrar Comentarios')).toBeTruthy();
    expect(getByText('Perfil')).toBeTruthy();
  });

  it('renders for Docente', () => {
    const userContextValue = configureMocksForRole('Docente');
    const { getByText } = render(
      <UserContext.Provider value={userContextValue}>
        <TabLayout />
      </UserContext.Provider>
    );

    expect(getByText('Herbicidas')).toBeTruthy();
    expect(getByText('Fungicidas e Insecticidas')).toBeTruthy();
    expect(getByText('Sección Informativa')).toBeTruthy();
    expect(getByText('Entorno Educativo')).toBeTruthy();
    expect(getByText('Perfil')).toBeTruthy();
  });

  it('renders for Estudiante', () => {
    const userContextValue = configureMocksForRole('Estudiante');
    const { getByText } = render(
      <UserContext.Provider value={userContextValue}>
        <TabLayout />
      </UserContext.Provider>
    );

    expect(getByText('Herbicidas')).toBeTruthy();
    expect(getByText('Fungicidas e Insecticidas')).toBeTruthy();
    expect(getByText('Sección Informativa')).toBeTruthy();
    expect(getByText('Entorno Educativo')).toBeTruthy();
    expect(getByText('Perfil')).toBeTruthy();
  });

  it('renders for Usuario Externo', () => {
    const userContextValue = configureMocksForRole('Usuario Externo');
    const { getByText } = render(
      <UserContext.Provider value={userContextValue}>
        <TabLayout />
      </UserContext.Provider>
    );

    expect(getByText('Herbicidas')).toBeTruthy();
    expect(getByText('Fungicidas e Insecticidas')).toBeTruthy();
    expect(getByText('Sección Informativa')).toBeTruthy();
    expect(getByText('Perfil')).toBeTruthy();
  });

  it('renders for no role', () => {
    const userContextValue = configureMocksForRole(null);
    const { queryByText } = render(
      <UserContext.Provider value={userContextValue}>
        <TabLayout />
      </UserContext.Provider>
    );

    expect(queryByText('Herbicidas')).toBeTruthy();
    expect(queryByText('Fungicidas e Insecticidas')).toBeTruthy();
    expect(queryByText('Sección Informativa')).toBeNull();
    expect(queryByText('Entorno Educativo')).toBeNull();
    expect(queryByText('Administrar Material')).toBeNull();
    expect(queryByText('Aprobación de Registro')).toBeNull();
    expect(queryByText('Administrar Comentarios')).toBeNull();
    expect(queryByText('Perfil')).toBeNull();
  });
});
