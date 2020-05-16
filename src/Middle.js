import React,{useState,useEffect} from 'react';
import {Button,Table,Modal,InputGroup,FormControl} from 'react-bootstrap'
import axios from 'axios'
import swal from 'sweetalert';
const Middle = ()=>{
    
const [show, setShow] = useState(false);
const [tasks,setTasks] = useState([])
const [add,setAdd] = useState(true)
const [addBtn,setAddBtn] = useState(true)
const [taskName,setTaskName] = useState("")
const [taskTime,setTaskTime] = useState("")
const [taskForUpdate,setTaskForUpdate] = useState("")
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

       
    

    const fetchData = ()=>{
        axios.get('http://localhost:8080/http://localhost:6000/')
        .then((res)=>{
            setTasks(res.data)
        })
        .catch()
    }

    useEffect(()=>{
        fetchData() 
         
     },[])

    const addClicked = ()=>{
        setAdd(true)
        setAddBtn(true)
        setTaskName("")
        setTaskTime("")
        handleShow()

    }
    
     const addTask = ()=>{
        handleClose()
        const tName = document.getElementById('task-name').value
        const tTime = document.getElementById('task-time').value
        axios.post('http://localhost:8080/http://localhost:6000/addTask',{
            'tName':tName,
            'tTime':tTime
        })
        .then((res)=>{
            if(res.data.status==="added"){
                swal("ADDED!","Task added succesfully","success")
                setTimeout(() => {
                   window.location.reload() 
                }, 1000);
                
            }
            else{
                swal("Error!","Something Went Wrong","error")
            }
        })
        .catch()
    }



    const upDate = (index)=>{
        setAdd(false)
        setAddBtn(false)
        handleShow()

        axios.get('http://localhost:8080/http://localhost:6000/')
        .then(res=>{
            console.log(res.data[index])
            setTaskName(res.data[index].taskName)
            setTaskForUpdate(res.data[index].taskName)
            setTaskTime(res.data[index].time)
        })
        .catch(err=>{

        })

    }

    const upDateBtn = ()=>{
        handleClose()
        const tName = document.getElementById('task-name').value
        const tTime = document.getElementById('task-time').value
        axios.post('http://localhost:8080/http://localhost:6000/upDate',{
            'tName':tName,
            'update':taskForUpdate,
            'tTime':tTime

        })
        .then((res)=>{
            if(res.data.status==="updated"){
                swal("UPDATED!","Task updated succesfully","success")
                setTimeout(() => {
                   window.location.reload() 
                }, 1000);
            }
            else{
                swal("Error!","Something Went Wrong","error")
            }
        })
        .catch()
    }

    const deleteTask = (tName)=>{
        axios.post('http://localhost:8080/http://localhost:6000/delete',{'tName':tName})
        .then(res=>{
            if(res.data.status==="deleted"){
                swal("Deleted!","Task Deleted succesfully","success")
                setTimeout(() => {
                   window.location.reload() 
                }, 1000); 
            }
        })
        .catch(err=>{

        })
    }

    const populate = (task,index)=>{     
        return(
            <tr key={index}>
                <td>{index}</td>
                <td>{task.taskName}</td>
                <td>{task.time}</td>
                <td>
                    <Button variant="secondary" onClick={()=>upDate(index)} >Update</Button>{' '}
                    <Button variant="secondary" onClick={()=>deleteTask(task.taskName)}>Delete</Button>
                </td>
            </tr>
            
            
        
        )
    }
    
    return(
        <div id="middle">
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Task Name </th>
                    <th>Time</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(populate)}
                </tbody>
            </Table>
            <Button variant="primary" onClick={addClicked}> Add Task </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                {add?<Modal.Title>ADD TASK</Modal.Title>:<Modal.Title>UPDATE TASK</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Task Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        id = "task-name"
                        defaultValue = {taskName}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Time</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        type="time"
                        id = "task-time"
                        defaultValue = {taskTime}
                    />
                </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                {
                    addBtn?<Button variant="primary" onClick={addTask}>ADD</Button>:<Button variant="primary" onClick={upDateBtn}>Update</Button>
                }
                
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Middle