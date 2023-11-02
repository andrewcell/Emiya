import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {l} from '../locale';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {VillagerStorage} from './interfaces';
import Axios, {AxiosResponse} from 'axios';
import {encrypt} from '../encryption/AES';
import {CodeCommentData} from '../repsonseBody';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface VillagersGroupCreateDialogProps {
    open: boolean;
    closeDialog: () => void;
    loginStatus: boolean;
    addToGroupList: (name: string) => void;
}

const VillagersAddGroupDialog = (props: VillagersGroupCreateDialogProps): React.ReactElement => {
    const { open, closeDialog, loginStatus } = props;
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState(false);
    const validate = (s: string): boolean => {
        const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/
        return regex.test(s)
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        if (!validate(value)) {
            setError(true);
        } else {
            setError(false);
            setName(e.currentTarget.value);
        }
    }
    const handleCreate = (): void => {
        if (!error) {
            if (loginStatus) {
                void Axios.post('/villagers/creategroup', {data: encrypt(name)})
                    .then((r: AxiosResponse<CodeCommentData>) => {
                        if (r.data.code === 'group00') {
                            props.addToGroupList(name);
                            closeDialog();
                        } else {
                            setSnackbar(true);
                        }
                    })
                    .catch(() => {
                        setSnackbar(true);
                    })
            } else {
                const storageJson = localStorage.getItem('myVillagers')
                if (storageJson == null) {
                    localStorage.setItem('myVillagers', `{"Default": [], "${name}": []}`)
                } else {
                    const storage = JSON.parse(storageJson) as VillagerStorage;
                    if (name in storage) {
                        setSnackbar(true);
                        return;
                    }
                    storage[name] = [];
                    localStorage.setItem('myVillagers', JSON.stringify(storage));
                    props.addToGroupList(name)
                    closeDialog();
                }
            }
        }
    }

    return (
        <>
            <Snackbar open={snackbar} autoHideDuration={3000} message={l('villagers.group.createrror')} action={
                <IconButton size="small" color="inherit">
                    <CloseIcon fontSize="small" />
                </IconButton>
            } />
            <Dialog open={open} onClose={closeDialog}>
                <DialogTitle>{l('villagers.group.createtitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{l('villagers.group.create')}</DialogContentText>
                    <TextField margin={'dense'} id={'username'} label={l('villagers.group.name')}
                               type={'text'} fullWidth onChange={handleChange} error={error}/>
                </DialogContent>
                <DialogActions>
                    <Button color={'inherit'} onClick={closeDialog}>{l('layout.login.close')}</Button>
                    <Button color={'primary'} onClick={handleCreate}>{l('villagers.group.add')}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default VillagersAddGroupDialog;