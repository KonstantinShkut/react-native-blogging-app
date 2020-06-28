import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTextInput } from '../hooks/useTextInput';
import {
  colorLightGray,
  colorSecondary,
  textError,
  textInput,
} from '../styles';
import { useStore } from '../store';
import { ButtonLink, ButtonRegular } from '../components';
import { HOME, ScreenProps, SIGN_UP } from '.';

export const SignUp = ({ route }: ScreenProps<typeof SIGN_UP>) => {
  const { auth } = useStore();
  const navigation = useNavigation();
  const { params } = route;
  const { isTryingToPost } = params || {};

  const [error, setError] = useState();
  const [name, nameInputProps] = useTextInput();
  const [email, emailInputProps] = useTextInput();
  const [password, passwordInputProps] = useTextInput();

  const handleSignUp = async () => {
    try {
      await auth.signup(email, password, name);
      if (isTryingToPost) {
        navigation.navigate('PostForm');
      } else {
        navigation.navigate(HOME);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const onPressLogin = () => navigation.navigate('Login');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={88}
      enabled>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.inner}>
        <View style={styles.top}>
          {isTryingToPost && (
            <Text>You need to sign up or log in first to be able to post.</Text>
          )}
          {error && <Text style={textError}>{error}</Text>}
          <TextInput
            placeholder="Your Name"
            autoCapitalize="words"
            style={textInput}
            {...nameInputProps}
          />
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            style={textInput}
            {...emailInputProps}
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            style={textInput}
            {...passwordInputProps}
          />
        </View>
        <View style={styles.bottom}>
          <ButtonRegular title="Sign Up" onPress={handleSignUp} />
          <ButtonLink
            color={colorSecondary}
            title="Already have an account? Login"
            onPress={onPressLogin}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorLightGray,
  },
  inner: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  top: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
