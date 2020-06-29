import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  View,
  ScrollView,
} from 'react-native';

import {
  Client,
  AccountBalanceQuery,
  AccountCreateTransaction,
  Hbar,
  Ed25519PublicKey,
  Ed25519PrivateKey,
} from '@hashgraph/sdk';

const operatorAccount = '0.0.x'; // Your account ID here
const operatorPrivateKey = '302e020100300506032b657004220420...'; // Your account private key here.

const client = Client.forTestnet();
client.setOperator(operatorAccount, operatorPrivateKey);

const App = () => {

  const [accountId, setAccountId] = useState('');

  const [publicKey, setPublicKey] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  const [privateKey, setPrivateKey] = useState<Ed25519PrivateKey>();

  useEffect(() => {
    generatePrivateKey();
  }, [])

  const getBalance = async () => {
    try {
      const balance = await new AccountBalanceQuery()
          .setAccountId(accountId)
          .execute(client);

      Alert.alert('Success', `Balance: ${balance.value().toString()} HBAR`)
    } catch (e) {
      Alert.alert('Error', e.toString())
    }
  }

  const createAccount = async () => {
    try {
      const transactionId = await new AccountCreateTransaction()
        .setKey(Ed25519PublicKey.fromString(publicKey))
        .setMaxTransactionFee(new Hbar(1))
        .setInitialBalance(new Hbar(initialBalance))
        .execute(client);

      const transactionReceipt = await transactionId.getReceipt(client);

      Alert.alert('Account created', `Account ID: ${transactionReceipt.getAccountId()}`)
    } catch (e) {
      Alert.alert('Error', e.toString())
    }
  }

  const generatePrivateKey = async () => {
    const pKey = await Ed25519PrivateKey.generate();
    setPrivateKey(pKey);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={ styles.container }>
        <ScrollView>
          <View style={ styles.sectionContainer }>
            <Text style={ styles.sectionTitle }>Generate keys</Text>
            <Text style={ styles.inputLabel }>Private Key</Text>
            <TextInput 
              placeholder=""
              style={styles.input}
              value={privateKey?.toString()}
            />
            <Text style={ styles.inputLabel }>Public Key</Text>
            <TextInput 
              placeholder=""
              style={styles.input}
              value={privateKey?.publicKey.toString()}
            />
            <Button 
              title="Generate keys" 
              onPress={() => { generatePrivateKey() }} 
            />
          </View>
          <View style={ styles.sectionContainer }>
            <Text style={ styles.sectionTitle }>Create Account</Text>
            <Text style={ styles.inputLabel }>Public Key</Text>
            <TextInput 
              placeholder="302a300506032b65700321007c..."
              style={styles.input}
              value={publicKey}
              onChangeText={text => setPublicKey(text)}
            />
            <Text style={ styles.inputLabel }>Initial balance</Text>
            <TextInput 
              placeholder="0"
              keyboardType="number-pad"
              style={styles.input}
              value={initialBalance}
              onChangeText={text => setInitialBalance(text)}
            />
            <Button 
              title="Create account" 
              onPress={() => { createAccount() }} 
            />
          </View>
          <View style={ styles.sectionContainer }>
            <Text style={ styles.sectionTitle }>Get Account Balance</Text>
            <Text style={ styles.inputLabel }>Account ID</Text>
            <TextInput 
              placeholder="0.0.1234"
              style={styles.input}
              value={accountId}
              onChangeText={text => setAccountId(text)}
            />
            <Button 
              title="Get balance" 
              onPress={() => { getBalance() }} 
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const MARGIN_BOTTOM = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: MARGIN_BOTTOM * 1.5,
  },
  sectionSubtitle: {
    fontSize: 18,
    marginBottom: MARGIN_BOTTOM * 1.3,
  },
  inputLabel: {
    marginBottom: MARGIN_BOTTOM,
    fontSize: 16,
  },
  input: {
    padding: 10,
    borderRadius: 4,
    borderColor: '#1a202c',
    borderWidth: 1,
    marginBottom: MARGIN_BOTTOM,
  },
});

export default App;
