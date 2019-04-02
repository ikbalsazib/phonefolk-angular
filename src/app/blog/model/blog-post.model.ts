export interface BlogPostModel {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  slugName: string;
  creator: {
    name: string
  };
}
