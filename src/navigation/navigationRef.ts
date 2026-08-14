import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types';

// Permite navegar a partir de componentes renderizados fora da árvore de
// telas (ex: DispatchModal, montado como irmão do Stack.Navigator em
// PFStack, não como uma Screen) — useNavigation() não funcionaria ali.
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
