import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { db } from "../database/firebaseConfig.js";
import { collection, docs, doc, deleteDoc, addDoc, updateDoc, where, query, orderBy, getDocs, limit } from "firebase/firestore";
import FormularioCiudades from "../Components/FormularioCiudades.js";
import TablaCiudades from "../Components/TablaCiudades.js";

const Ciudades = ({ cerrarSesion }) => {

  useEffect(() => {
    obtenerCiudadesMasPobladas();
    listarHondurasMayor700kNombreAscLimit3();
    obtener2SalvadorPoblacionAsc();
    mostrarCentroamericanasMenorIgual300kPaisDescLimit4();
    obtenerMayor900kOrdenNombre();
    listarGuatemaltecasPoblacionDescLimit();
    obtenerEntre200y600kPaisAscLimit5();
    listarTop5PoblacionRegionDesc();
  }, []);

  async function obtenerCiudadesMasPobladas() {
    const q = query(
      collection(db, "ciudades"),
      where("pais", "==", "Guatemala"),
      orderBy("población", "desc"),
      limit(2)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.data().nombre));
  }

  
  async function listarHondurasMayor700kNombreAscLimit3() {
    const q = query(
      collection(db, "ciudades"),
      where("pais", "==", "Honduras"),
      where("poblacion", ">", 700000),
      orderBy("poblacion"),
      orderBy("nombre", "asc"),
      limit(3)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.data().nombre));
  }

  // 2 ciudades salvadoreñas por población ascendente
  async function obtener2SalvadorPoblacionAsc() {
    const q = query(
      collection(db, "ciudades"),
      where("pais", "==", "El Salvador"),
      orderBy("poblacion", "asc"),
      limit(2)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.data().nombre));
  }

  async function mostrarCentroamericanasMenorIgual300kPaisDescLimit4() {
    const q = query(
      collection(db, "ciudades"),
      where("pais", "in", ["Guatemala", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Belice"]),
      where("poblacion", "<=", 300000),
      orderBy("poblacion"),
      orderBy("país", "desc"),
      limit(4)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.data().nombre));
  }

  
  async function obtenerMayor900kOrdenNombre() {
    const q = query(
      collection(db, "ciudades"),
      where("poblacion", ">", 900000),
      orderBy("poblacion"),
      orderBy("nombre", "asc"),
      limit(3)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.data().nombre));
  }

  // Guatemaltecas por población desc, limit(5)
  async function listarGuatemaltecasPoblacionDescLimit() {
    const q = query(
      collection(db, "ciudades"),
      where("pais", "==", "Guatemala"),
      orderBy("poblacion", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.data().nombre));
  }

 
  async function obtenerEntre200y600kPaisAscLimit5() {
    const q = query(
      collection(db, "ciudades"),
      where("poblacion", ">=", 200000),
      where("poblacion", "<=", 600000),
      orderBy("poblacion"),
      orderBy("pais", "asc"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.data().nombre));
  }

  
  async function listarTop5PoblacionRegionDesc() {
    const q = query(
      collection(db, "ciudades"),
      orderBy("poblacion", "desc"),
      orderBy("region", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.data().nombre));
  }


  return (

    <View style={styles.container}>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Ciudades;


