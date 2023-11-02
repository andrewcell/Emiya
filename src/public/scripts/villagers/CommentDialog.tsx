import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Axios, {AxiosResponse} from 'axios';
import {emiyaJ, url} from '../api';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {decryptJava, encryptJava} from '../encryption/AES';
import {DialogActions} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {l} from '../locale';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';
import {Data} from '../repsonseBody';

interface CommonDialogProps {
    code: string;
    open: boolean;
    handleClose: () => void;
}

interface CommonDialogState {
    status: Status;
    comments: Comment[];
    commentInput: string;
    nicknameInput: string;
    textFieldMessage: string;
    textFieldError: boolean;
}

type Comment = {
    nickname: string;
    ip: string;
    comment: string;
    // eslint-disable-next-line camelcase
    commented_at: Date;
}

enum Status {
    loading, empty, complete, error
}

class CommentDialog extends React.Component<CommonDialogProps, CommonDialogState> {
    constructor(props: CommonDialogProps) {
        super(props);
        this.state = {
            comments: [],
            status: Status.loading,
            commentInput: '',
            nicknameInput: 'anonymous',
            textFieldMessage: '',
            textFieldError: false
        }
    }

    componentDidMount(): void {
        Axios.post(url(emiyaJ, 'comment', 'get'), {data: encryptJava(this.props.code)})
            .then((r: AxiosResponse<Data>) => {
                const data = JSON.parse(decryptJava(r.data.data)) as Comment[];
                if (data.length <= 0) {
                    this.setState({comments: [], status: Status.empty});
                    return;
                }
                this.setState({comments: data, status: Status.complete});
            })
            .catch(() => {
                this.setState({status: Status.error});
            })
    }

    handlePost = (): void => {
        if (!this.state.textFieldError && this.state.commentInput.length >= 4) {
            const {nicknameInput, commentInput} = this.state;
            const {code} = this.props;
            Axios.post(url(emiyaJ, 'comment', 'post'), {
                nickname: nicknameInput,
                data: encryptJava(code),
                comment: commentInput
            })
                .then(() => {
                    const newComment: Comment = {
                        nickname: nicknameInput,
                        comment: commentInput,
                        ip: '',
                        // eslint-disable-next-line camelcase
                        commented_at: new Date()
                    }
                    this.setState(prevState => ({
                        status: Status.complete,
                        comments: [...prevState.comments, newComment]
                    }));
                })
                .catch(() => {
                    this.setState({status: Status.error})
                })
        }
    }

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.currentTarget.value;
        if (value.length >= 4) {
            this.setState({commentInput: value, textFieldError: false, textFieldMessage: ''});
        } else {
            this.setState({textFieldMessage: l('villagers.comment.atleast4letters'), textFieldError: true});
        }
    }

    handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.currentTarget.value;
        if (value.length >= 4) {
            this.setState({nicknameInput: value, textFieldError: false, textFieldMessage: ''});
        } else {
            this.setState({textFieldMessage: l('villagers.comment.atleast4letters'), textFieldError: true});
        }
    }

    getContent(): JSX.Element {
        const { status } = this.state;
        switch (status) {
            case Status.complete:
                return (
                    <List>
                        {this.state.comments.map((comment, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={comment.comment} secondary={comment.nickname + ' - ' + moment(comment.commented_at).format('LLLL')} />
                            </ListItem>
                        ))}
                    </List>
                )
            case Status.empty:
                return <DialogContentText>{l('villagers.comment.empty')}</DialogContentText>
            case Status.error:
                return <DialogContentText>{l('villagers.comment.error')}</DialogContentText>
            case Status.loading:
            default:
                return (
                    <DialogContentText>
                        Please wait.
                    </DialogContentText>
                )
        }
    }

    getCommentField(): JSX.Element | null {
        switch (this.state.status) {
            case Status.complete:
            case Status.empty:
                return <TextField id={'comment'} label={l('villagers.detail.comments')} margin={'dense'} fullWidth onChange={this.handleInputChange} helperText={this.state.textFieldMessage} error={this.state.textFieldError}/>
            default:
                return null;
        }
    }

    getPostActions(): JSX.Element | null {
        switch (this.state.status) {
            case Status.complete:
            case Status.empty:
                return (
                    <>
                        <TextField label={l('villagers.comment.nickname')} onChange={this.handleNicknameChange} variant={'outlined'} defaultValue={'anonymous'} helperText={this.state.textFieldMessage} error={this.state.textFieldError} />
                        <Button onClick={this.handlePost} color={'primary'}>{l('villagers.comment.post')}</Button>
                    </>
                )
            default:
                return null;
        }
    }

    render(): React.ReactElement {
        const { open, handleClose } = this.props;
        return (
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle>{l('villagers.detail.comments')}</DialogTitle>
                <DialogContent>
                    {this.getContent()}
                    {this.getCommentField()}
                </DialogContent>
                <DialogActions>
                    {this.getPostActions()}
                    <Button onClick={handleClose}>{l('villagers.detail.close')}</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default CommentDialog;