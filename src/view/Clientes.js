import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseConfig.js";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import FormularioCliente from "../Components/FormularioCliente.js";
import TablaClientes from "../Components/TablaClientes.js";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const eliminarClientes = async (id) => {
    try {
      await deleteDoc(doc(db, "clientes", id));
      await cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error)
    }
  };

  return (
    <View style={styles.container}>
      <FormularioCliente cargarDatos={cargarDatos} />
      <TablaClientes
        clientes={clientes}
        eliminarClientes={eliminarClientes}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Clientes;