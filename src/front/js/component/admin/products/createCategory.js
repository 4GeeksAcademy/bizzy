import React, { useState, useContext} from "react";
import { Context } from "../../../store/appContext";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { storage } from "../../../hooks/useFirebase";
import { useRef } from 'react';


import { toast } from 'react-toastify';
import { BsFillCloudUploadFill } from "react-icons/bs"
import { AiOutlineCloseCircle } from "react-icons/ai";
import "../../../../styles/createCategory.css";

export const CreateCategory = (create) => {
	const placeholderImage = "https://firebasestorage.googleapis.com/v0/b/bizzy-da700.appspot.com/o/placeholder-image.jpg?alt=media&token=02f6aa41-62db-4321-912c-02d5fb6ca9a7&_gl=1*awbatw*_ga*MTgwNzc5NjIwMS4xNjk2Mjk0ODc2*_ga_CW55HF8NVT*MTY5ODA0OTA4NS41LjEuMTY5ODA0OTEzOC43LjAuMA.."
    const { store, actions } = useContext(Context);
    const background = useRef(null);
	const ref = useRef(null);
	const [ tempImage, setTempImage ] = useState("")
	const [ fileName, setFileName ] = useState("")
    const [ category, setCategory ] = useState(
        {
            "name":""
        }
    )

	function handleImage(e){
		setTempImage(e.target.files[0])
		setFileName(e.target.value)
	}
    
    async function createNewCategory(){
		// SEARCH FOR EXISTENT CATEGORY
		const repeated = store.categories.filter((item) => item.name == category.name)
		if (repeated.length > 0){
			toast.error("Ya existe una categoria con este nombre",{
				position: "bottom-center"})
			return
		}

        // SEARCH FOR UNFILLED FIELDS
        for (let value in category){
			if (!category[value]){
				toast.error("Rellena todos los campos",{
					position: "bottom-center"})
				return
			}
		}

		// UPLOAD IMAGE
		const url = await uploadFile();
		if(url == false) return false;


		// POST CATEGORY
		let info = await actions.postCategory({...category, "icon": url })
		if(info){
			toast.success("Categoria creada con exito!")
            background.current.click()
			return
		}
		else{
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"
			})
		}
	}

	const uploadFile = async () => {
        if (!tempImage) {
            toast.error("Porfavor agrega una imagen",{
				position: "bottom-center"})
            return false
        }
        const imageRef = storageRef(storage, `category/${category.name}`);

        try{
            const uploadResp = await uploadBytes(imageRef, tempImage)
            const url =  await getDownloadURL(uploadResp.ref)
            return url
        }
		catch(err){
			toast.error("Ocurrio un error inesperado",{
				position: "bottom-center"})
			return false
        }
    };

	return (<>
		<div ref={background} onClick={create.close} className="background"/>
            <div className="popup-body">
                <div className="create-container">
                    <div className="popup-header">
                        <h2> Crear categoria </h2>
                        <AiOutlineCloseCircle className="popup-close" onClick={create.close} />
                    </div>
                    
                    <div className="input-holder">
						<label>Nombre</label>
						<input required placeholder="Ingresa el nombre de la categoria"
						onChange={(e)=> setCategory({...category, "name":e.target.value })}></input>
					</div>



			<label>Icono<span style={{color: "#7B57DF"}}>*</span></label>
			<div className="uploaded-category-image">
				{!tempImage && <>
								<img src={placeholderImage} width={"300px"}/>
								<span style={{color: "#9b9b9b"}}>No has seleccionado una imagen aun...</span>
							</>}
				{tempImage && <>
								<img src={URL.createObjectURL(tempImage)} width={"300px"}/>
								<span>{fileName.substring(12)}</span>
							</>}
				<AiOutlineCloseCircle 
				onClick={()=> setTempImage()}
				className="delete-category-image"/>
			</div>

			<div className="category-upload-image-container">
				<div className="upload-category-image">
					<BsFillCloudUploadFill className="upload-category-icon"/>
					<button onClick={()=>ref.current.click()}>Selecciona la Imagen</button>
					<p>o</p>
					<p>Sueltala acá</p>
					
				</div>
				<input
					className="image-category-input"
					ref={ref}
					onChange={(e) => handleImage(e)}
					type="file"
					accept="image/png, image/jpeg"/>
			</div>


                    <div className="button-container">
                    <button onClick={()=> createNewCategory()}>Crear</button>
                    </div>
                </div>
            </div>
        </>
	);
};
