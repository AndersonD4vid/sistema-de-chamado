import React, { useState, createContext, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../services/conexaoFirebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
// doc = acessar documentos, getDoc = Pegar documentos, setDoc = Criar novo documento
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loadingAuth, setLoadingAuth] = useState(false);
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   useEffect(() => {
      async function loadUser() {
         const storageUser = localStorage.getItem("@usuariosKey");

         if (storageUser) {
            setUser(JSON.parse(storageUser)); // JSON.parse = convertendo para objeto
            setLoading(false);
            navigate("/dashboard");
         } else {
            setLoading(false);
         }
      }
      loadUser();
   }, [])


   // Efetuar login
   async function login(email, password) {
      setLoadingAuth(true);

      await signInWithEmailAndPassword(auth, email, password)
         .then(async (value) => {
            // Pegar ID do usuário
            let uid = value.user.uid;

            // accesando o banco de dados, na coleção de usuários, na informação do ID do usuário
            const docRef = doc(db, "usuarios", uid);
            const docRetorno = await getDoc(docRef);

            let data = {
               uid: uid,
               name: docRetorno.data().name,
               email: value.user.email,
               avatarUrl: docRetorno.data().avatarUrl
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success("Bem-vindo(a) de volta!");
            // Navegando o usuário para a tela de dashboard
            navigate("/dashboard");
         }).catch((error) => {
            console.log(error)
            setLoadingAuth(false);
            toast.error("Erro: Ops! Algum dado estar errado!");


         })
   }


   // Cadastrar novo usuário
   async function cadastrar(name, email, password) {
      setLoadingAuth(true);

      await createUserWithEmailAndPassword(auth, email, password)
         .then(async (value) => {
            // Pegar ID do usuário
            let uid = value.user.uid;

            // criando uma coleção de usuários e dentro criando um documento que é o ID de usuário. 
            // Exemplo: usuarios > 123 > informações do usuário
            await setDoc(doc(db, "usuarios", uid), {
               name: name,
               avatarUrl: null,
            }).then(() => {
               let data = {
                  uid: uid,
                  name: name,
                  email: value.user.email,
                  avatarUrl: null
               };

               setUser(data);
               storageUser(data);
               setLoadingAuth(false);
               toast.success("Bem-vindo(a) ao sistema!");
               // Navegando o usuário para a tela de dashboard
               navigate("/dashboard");
            })
         }).catch((error) => {
            console.log(error)
            setLoadingAuth(false);
            //toast.success("Ops! Algo deu errado!");
            if (error.code === 'auth/weak-password') {
               toast.error("A senha deve ter pelo menos 6 caracteres!");
            }
            if (error.code === 'auth/email-already-in-use') {
               toast.error("Erro: Esse e-mail já estar em uso!");
            }
            if (error.code === 'auth/invalid-email') {
               toast.error("Erro: Esse e-mail estar errado!");
            }

         })
   }

   async function logOut() {
      await signOut(auth)
         .then(() => {
            toast.success("Até logo ;)");
            navigate("/");
         })
         .catch((error) => {
            toast.success(error);
         });
      localStorage.removeItem("@usuariosKey");
      setUser(null);
   }

   // Salvando dados do usuário no localStorage
   function storageUser(data) {
      localStorage.setItem("@usuariosKey", JSON.stringify(data)); // JSON.stringify = convertendo para string
   }

   return (
      <AuthContext.Provider
         value={{
            signed: !!user, // !! converte para boolean
            user,
            setUser,
            login,
            cadastrar,
            logOut,
            loadingAuth,
            loading,
            storageUser
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}
