import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';

import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const shoppinglist = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      setItems(shoppinglist)
    });
  }, []);
    
  const saveItem = () => {
    push(
      ref(database, 'items/'),
      { 'product': product, 'amount': amount });
  }

  const deleteItem = (key) => {
    remove(
      ref(database, 'items/' + key))
  };

    return (
      <View style={styles.container}>
        <TextInput 
          style={styles.input}
          placeholder='Product'
          onChangeText={product => setProduct(product)}
          value={product}/>
        <TextInput
          style={styles.input}
          placeholder='Amount'
          onChangeText={amount => setAmount(amount)}
          value={amount}/>
        <Button onPress={saveItem} title="Save" />
        <Text style={styles.listtitle}>Shopping list</Text>
        <FlatList 
          data={items}
          keyExtractor={item => item.key}
          renderItem={({item}) =>
            <View style={styles.flatlistcontainer}>
              <Text>{item.product}, {item.amount}</Text>
              <Text style={styles.deletebutton} onPress={() => deleteItem(item.key)}>delete</Text>
            </View>}
        />
        <StatusBar style="auto" />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
    },
    input: {
      marginTop: 5, 
      marginBottom: 5, 
      padding: 5,
      width: 200, 
      height: 40, 
      borderColor:'gray', 
      borderWidth: 1,
    },
    flatlistcontainer: {
     flexDirection: 'row',
     backgroundColor: '#fff',
     alignItems: 'center',
     marginTop: 10,
    },
    listtitle: {
      marginTop: 30, 
      fontSize: 18,
    },
    deletebutton: {
      color: 'blue', 
      marginLeft: 10
    },
  });
  
