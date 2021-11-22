import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, Res } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDTO } from './dto/create-post.dto';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get('posts')
  async getPosts(@Res() res) {
    const posts = await this.blogService.getPosts();
    return res.status(HttpStatus.OK).json(posts);
  }

  @Get('post/:postId')
  async getPost(@Res() res, @Param('postID') postID) {
    const post = await this.blogService.getPost(postID);
    if (!post) throw new NotFoundException('Пост не найден!');
    return res.status(HttpStatus.OK).json(post);
  }

  @Post('/post')
    async addPost(@Res() res, @Body() createPostDTO: CreatePostDTO) {
        const newPost = await this.blogService.addPost(createPostDTO);
        return res.status(HttpStatus.OK).json({
            message: "Пост был добавлен",
            post: newPost
        })
    }

  @Put('/edit')
  async editPost(
    @Res() res,
    @Query('postID') postID,
    @Body() createPostDTO: CreatePostDTO
  ) {
    const editedPost = await this.blogService.editPost(postID, createPostDTO);
    if (!editedPost) throw new NotFoundException('Пост не найден!');
    return res.status(HttpStatus.OK).json({
      message: 'Пост был обновлен',
      post: editedPost
    }) 
  }

  @Delete('/delete')
    async deletePost(@Res() res, @Query('postID') postID) {
        const deletedPost = await this.blogService.deletePost(postID);
        if (!deletedPost) throw new NotFoundException('Пост не найден!');
        return res.status(HttpStatus.OK).json({
            message: 'Пост был удален!',
            post: deletedPost
        })
    }
}
