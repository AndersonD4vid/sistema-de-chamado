import React, { useContext, useState } from 'react';
import '../../components/Header';
import './style.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from "react-icons/fi";
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import avatarImg from '../../assets/avatar.jpg'
import { db, storage } from '../../services/conexaoFirebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, } from 'firebase/storage';


export default function Profile() {
   const { user, setUser, storageUser } = useContext(AuthContext);

   const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
   const [imageAvatar, setImageAvatar] = useState(null);
   const [nome, setNome] = useState(user && user.name);
   const [email, setEmail] = useState(user && user.email);

   function handleFile(e) {
      if (e.target.files[0]) {
         const image = e.target.files[0];
         if (image.type === 'image/jpeg' || image.type === 'image/png') {
            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(image)); // Converter imagem para objeto URL
         } else {
            toast.error("Erro: Somente imagem PNG OU JPEG!");
         }
      }
   }


   // Atualizar foto de perfil
   async function handleUpload() {
      const currentUID = user.uid;

      const uploadRef = ref(storage, `imagens/${currentUID}/${imageAvatar.name}`);

      // Enviando foto para o storage
      const uploadTask = uploadBytes(uploadRef, imageAvatar)
         .then((snapshot) => {

            // Pegando a URL que tem no input
            getDownloadURL(snapshot.ref).then(async (downloadURL) => {
               let urlFoto = downloadURL;


               // Atualizando dados
               const docRef = doc(db, 'usuarios', user.uid)
               await updateDoc(docRef, {
                  avatarUrl: urlFoto,
                  name: nome,

               })
                  .then(() => {
                     let data = {
                        ...user,
                        name: nome,
                        avatarUrl: urlFoto
                     }

                     setUser(data);
                     storageUser(data);
                     toast.success("Sucesso: Dados alterado!");
                  })
            })

         })
   }

   // Atualizar dados do input
   async function handleSubmit(e) {
      e.preventDefault();

      if (imageAvatar === null && nome !== '') {
         // Atualizar apenas o nome
         const docRef = doc(db, "usuarios", user.uid);
         await updateDoc(docRef, {
            name: nome,
         }).then(() => {
            let data = {
               ...user,
               name: nome,
            }

            setUser(data);
            storageUser(data);
            toast.success("Sucesso: Nome alterado!");
         })
      } else if (nome !== '' && imageAvatar !== null) {
         // Atualizar nome e foto de perfil
         handleUpload();
      }
   }
   return (
      <div className='content'>
         <Header />

         <div className='contentDash'>
            <Title name="Minha conta">
               <FiSettings color='#333' size={24} />
            </Title>

            <div className='areaPerfil'>
               <form onSubmit={handleSubmit}>
                  <div className='areaAvatar'>
                     <label className='boxAvatar'>
                        <span className='iconeUpload'>
                           <FiUpload color='#fff' size={25} />
                           <span>Alterar foto</span>
                        </span>
                        <div className='overlayFotoPerfil'></div>

                        <input
                           type='file'
                           accept="image/*"
                           onChange={handleFile}
                        /> <br />

                        {avatarUrl === null ?
                           (
                              <img src={avatarImg} alt="Foto de perfil" className='avatar' />
                           )
                           :
                           (
                              <img src={avatarUrl} alt="Foto de perfil" className='avatar' />
                           )
                        }
                     </label>
                  </div>

                  <div className='areaInputs'>
                     <label>Nome</label>
                     <input
                        type='text'
                        value={nome}
                        placeholder={nome}
                        onChange={(e) => setNome(e.target.value)}
                     />

                     <label>E-mail</label>
                     <input
                        type='email'
                        placeholder={email}
                        disabled={true}
                        style={{
                           cursor: 'not-allowed'
                        }}
                     />

                     <button type='submit' className='botao'>Salvar</button>
                  </div>
               </form>
            </div>

         </div>

      </div>
   );
}