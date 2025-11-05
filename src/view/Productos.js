import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Alert, ScrollView } from "react-native";
import { db } from "../database/firebaseConfig.js";
import {  collection, getDocs, deleteDoc, doc, addDoc, updateDoc 
} from "firebase/firestore";
import FormularioProductos from "../Components/FormularioProductos.js";
import TablaProductos from "../Components/TablaProductos.js";

// === NUEVAS IMPORTACIONES ===
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

// === COLECCIONES ===
const colecciones = ["productos", "usuarios", "edades", "ciudades"];

const Productos = ({ cerrarSesion }) => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });
  const [idProducto, setIdProducto] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // === CARGAR UNA COLECCIÓN ===
  const cargarColeccion = async (nombre) => {
    try {
      const querySnapshot = await getDocs(collection(db, nombre));
      const datos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { [nombre]: datos };
    } catch (error) {
      console.error(`Error cargando ${nombre}:`, error);
      Alert.alert("Error", `No se pudo cargar: ${nombre}`);
      return { [nombre]: [] };
    }
  };

  // === CARGAR TODAS LAS COLECCIONES ===
  const cargarDatosFirebase = async () => {
    const promesas = colecciones.map(coleccion => cargarColeccion(coleccion));
    const resultados = await Promise.all(promesas);
    return resultados.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  };

  // === EXPORTAR DATOS (ARCHIVO + PORTAPAPELES) ===
  const exportarDatos = async (datos, nombreArchivo = "datos.txt") => {
    try {
      const texto = JSON.stringify(datos, null, 2);

      // Copiar al portapapeles
      await Clipboard.setStringAsync(texto);
      Alert.alert("Éxito", "Datos copiados al portapapeles");

      // Guardar archivo
      const path = `${FileSystem.documentDirectory}${nombreArchivo}`;
      await FileSystem.writeAsStringAsync(path, texto, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Compartir
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path);
      } else {
        Alert.alert("Guardado", `Archivo en: ${path}`);
      }
    } catch (error) {
      console.error("Error exportando:", error);
      Alert.alert("Error", "No se pudo exportar");
    }
  };

  // === TUS FUNCIONES ORIGINALES (sin cambios) ===
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const manejoCambio = (campo, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarProducto = async () => {
    if (nuevoProducto.nombre && nuevoProducto.precio) {
      try {
        await addDoc(collection(db, "productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        cargarDatos();
      } catch (error) {
        console.error("Error al registrar producto:", error);
      }
    } else {
      Alert.alert("Error", "Complete todos los campos.");
    }
  };

  const actualizarProducto = async () => {
    if (nuevoProducto.nombre && nuevoProducto.precio && idProducto) {
      try {
        await updateDoc(doc(db, "productos", idProducto), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        setIdProducto(null);
        setModoEdicion(false);
        cargarDatos();
      } catch (error) {
        console.error("Error al actualizar producto:", error);
      }
    } else {
      Alert.alert("Error", "Complete todos los campos.");
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({ nombre: producto.nombre, precio: producto.precio.toString() });
    setIdProducto(producto.id);
    setModoEdicion(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Cerrar Sesión" onPress={cerrarSesion} color="red" />

      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />

      <TablaProductos
        productos={productos}
        eliminarProducto={eliminarProducto}
        editarProducto={editarProducto}
      />

      {/* === BOTONES DE EXPORTACIÓN === */}
      <View style={styles.exportContainer}>
        <View style={styles.botonExport}>
          <Button
            title="Exportar productos"
            color="#3d7392ff"
            onPress={async () => {
              const datos = await cargarColeccion("productos");
              await exportarDatos(datos, "productos.txt");
            }}
          />
        </View>

        <View style={styles.botonExport}>
          <Button
            title="Exportar usuarios"
            color="#3d7392ff"
            onPress={async () => {
              const datos = await cargarColeccion("usuarios");
              await exportarDatos(datos, "usuarios.txt");
            }}
          />
        </View>

        <View style={styles.botonExport}>
          <Button
            title="Exportar edades"
            color="#3d7392ff"
            onPress={async () => {
              const datos = await cargarColeccion("edades");
              await exportarDatos(datos, "edades.txt");
            }}
          />
        </View>

        <View style={styles.botonExport}>
          <Button
            title="Exportar ciudades"
            color="#3d7392ff"
            onPress={async () => {
              const datos = await cargarColeccion("ciudades");
              await exportarDatos(datos, "ciudades.txt");
            }}
          />
        </View>

        <View style={[styles.botonExport, { marginTop: 15 }]}>
          <Button
            title="Exportar TODAS las colecciones"
            color="#3d7392ff"
            onPress={async () => {
              const datos = await cargarDatosFirebase();
              await exportarDatos(datos, "todas_las_colecciones.txt");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  exportContainer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  botonExport: {
    marginBottom: 10,
  },
});

export default Productos;