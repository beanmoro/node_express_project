import path from "path";
import { Router } from "express";
import { writeFile, readFile, rename, unlink } from "fs/promises";
import slugify from "slugify";

const __dirname = import.meta.dirname;

const router = Router();

router.get("/", (req, res) => {

    const {success, error} = req.query;


    return res.render("archivos", {success, error});
});

router.post("/crear", async (req, res) => {
  try {

    const { archivo, contenido } = req.body

    if(!archivo || !contenido || !archivo.trim() || !contenido.trim()){
        return res.status(400).redirect('/archivos?error=todos los campos son obligatorios');
    }

    const slug = slugify(archivo, {
        trim: true,
        lower: true,
        strict: true
    })

    const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`);


    await writeFile(ruta, contenido);
    return res.status(201).redirect("/archivos?success=se creo el archivo con exito");
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/archivos?error=error al crear el archivo');
  }
});


router.get('/leer', async (req, res) => {
    try{
        const {archivo}  = req.query


        const slug = slugify(archivo, {
            trim: true,
            lower: true,
            strict: true
        })

        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`);

        const contenido = await readFile(ruta, 'utf-8');
    
        console.log(archivo)
        return res.redirect('/archivos?success='+contenido)
    }catch(error){
        console.log(error)
        return res.status(500).redirect('/archivos?error=error al leer el archivo')
    }
}); 


router.post('/renombrar', async(req, res)=>{

    try {
        const {archivo, nuevoNombre} = req.body

        const slug = slugify(archivo, {
            trim: true,
            lower: true,
            strict: true
        })

        const newSlug = slugify(nuevoNombre, {
            trim: true,
            lower: true,
            strict: true
        })

        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`);
        const nuevaRuta = path.join(__dirname, `../data/archivos/${newSlug}.txt`);

        await rename(ruta, nuevaRuta);

        return res.status(200).redirect("/archivos?success=se renombro el archivo con exito");
    } catch (error) {
        console.log(error)
        return res.status(500).redirect('/archivos?error=error al renombrar el archivo')
    }

})

router.get('/eliminar', async(req, res)=>{

    try {

        const { archivo } = req.query

        const slug = slugify(archivo, {
            trim: true,
            lower: true,
            strict: true
        })

        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`);

        await unlink(ruta);

        return res.status(200).redirect("/archivos?success=se elimino el archivo con exito");
    } catch (error) {
        console.log(error)
        return res.status(500).redirect('/archivos?error=error al eliminar el archivo')
    }
})

export default router;
