import z from 'zod'

const usuarioSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }),
    email: z.string({
        invalid_type_error: 'El email debe contener un @',
        required_error: 'El email es requerido'
    }).email({
        message: 'El email no es valido'
    }),
    password: z.string({
        invalid_type_error: 'La contraseña debe contener caracteres',
        required_error: 'La contraseña es requerida'
    }).min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres'
    })

})

export function validateUsuario(usuario){
    return usuarioSchema.safeParse(usuario)
}

export function validatePartialUsuario(usuario){
    return usuarioSchema.partial().safeParse(usuario)
}