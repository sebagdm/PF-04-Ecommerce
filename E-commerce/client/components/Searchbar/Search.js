import { Input, InputGroup, InputLeftElement, Spacer, Stack, Text, Button, } from '@chakra-ui/react'
import Link from 'next/link'
import {useState} from 'react'
import { IoSearchSharp } from 'react-icons/io5'
import {getProductsByName} from '../../redux/actions/products'
import { useDispatch } from 'react-redux'

const Search = () => {

  const dispatch = useDispatch()
  const [name, setName] = useState('')

  const handleInputProducts = (e) => {
    e.preventDefault()
    setName(e.target.value)
  }
  const handleSubmit = (e) => {
    // console.log(e)
    e.preventDefault()
    dispatch(getProductsByName(name))
    setName("")
  }


  const handleKeyDown = (event) => { 
    if(event.key === "Enter"){             
      event.preventDefault();             
      dispatch(getProductsByName(name));            
      setName('');         
    }    
  }

  return (
    <Stack spacing={4} width='50%'  ali={{base:'center'}}>
      <InputGroup>
        <Input 
        onKeyDown = {(e) => handleKeyDown(e)}
        borderStartRadius='15px' 
        borderEndRadius='0' 
        bgColor='#FAFAFC'
        border maxWidth='40em' 
        type='text' 
        placeholder='Product...' 
        onChange = {(e) => handleInputProducts(e)}
        value = {name}
        />
        <Button 
          borderStartRadius='0' 
          borderEndRadius='15px' 
          textColor='blackAlpha.800'
          onClick={(e) => handleSubmit(e)} type='submit'> <IoSearchSharp/>      
        </Button>
      </InputGroup>
    </Stack>
  )
}

export default Search

