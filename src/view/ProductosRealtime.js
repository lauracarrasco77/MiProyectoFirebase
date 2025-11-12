import { StyleSheet, Text, View, TextInput, Button, } from 'react-native'
import { useEffect, useState } from 'react'

import { ref, set, push, onValue } from "firebase/database";
import { realtire08 } from "../database/firebaseConfig";
import { getDatabase } from "firebase/database";
import { app } from '../database/firebaseConfig';

export default function ProductosRealtime() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [productosRT, setProductosRT] = useState([]);
  const realtimeDB = getDatabase(app);
  

  const guardarEnRT = async () => {
    if (!nombre || !precio) {
      alert('Por favor complete todos los campos');
      return;
    }
    try {
      const referencia = ref(realtimeDB, 'productos_rt/');
      const nuevoRef = push(referencia); //crea id nuevo

      await set(nuevoRef, {
        nombre,
        precio: Number(precio)
      });

      setNombre('');
      setPrecio('');

      alert('Producto guardado en Realtime Database');
    } catch (error) {
      alert('Error al guardar el producto: ' + error.message);
    }
  };

  const leerRT = () => {
    const referencia = ref(realtimeDB, 'productos_rt/');

    onValue(referencia, (snapshot) => {
      if (snapshot.exists()) {
        const dataObj = snapshot.val();
        const lista = Object.entries(dataObj).map(([id, datos]) => ({
          id,
          ...datos
        }));

        setProductosRT(lista);
      } else {
        setProductosRT([]);
      }
    });
  };

  useEffect(() => {
    leerRT();
  }, []);



  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Prueba Realtime Database</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre producto"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />

      <Button title="Guardar en Realtime" onPress={guardarEnRT} />

      <Text style={styles.subtitulo}>Productos en RT:</Text>

      {productosRT.length === 0 ? (
        <Text>No hay productos</Text>
      ) : (
        productosRT.map((p) => (
          <Text key={p.id}>
            {p.nombre} - ${p.precio}
          </Text>
        ))
      )}
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});