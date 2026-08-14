import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

let confirmation: FirebaseAuthTypes.ConfirmationResult | null = null;

export const firebaseAuth = {
  async sendVerificationCode(phoneDigits: string): Promise<void> {
    // phoneDigits = somente números ex: "11999998888"
    const formatted = `+55${phoneDigits}`;
    confirmation = await auth().signInWithPhoneNumber(formatted);
  },

  async confirmCode(code: string): Promise<void> {
    if (!confirmation) throw new Error('Nenhum código pendente. Solicite novamente.');
    await confirmation.confirm(code);
  },
};
