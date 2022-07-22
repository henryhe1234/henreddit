import React from 'react'
import {Form,Formik} from 'formik'
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useMutation } from 'urql';
import { useRegisterMutation } from '../generated/graphql';
interface registerProps {

}



export const Register: React.FC<registerProps> = ({}) => {
  const [,register] = useRegisterMutation()
    return (
      <Wrapper variant='small'>
      <Formik initialValues={{username:"",password:""}}
        onSubmit={async (values,{setErrors})=>{
          const response = await register(values);
          if(response.data?.register.errors){
            setErrors({
              username:"hey error!"
            })
          }
          
        }}
      >
        {({isSubmitting})=>(
          <Form>
            <InputField name='username' placeholder='username' label='Username'  />
            <Box mt={4}>

            <InputField name="password" placeholder='password' label='Password' type="password" />
            </Box>
            <Button mt={4} type="submit" colorScheme='teal' isLoading={isSubmitting}>Submit</Button>
          </Form>
        )}
      </Formik>
      </Wrapper>
      );
}
export default Register