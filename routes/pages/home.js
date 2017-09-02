import User from '../../models/user'

export default async ctx => {
  const data = {}
  const { user } = ctx.session
  // signed in
  if (user) {
    const result = await User.findById(user)
    !({
      name: data.name,
      email: data.email,
      joindate: data.joindate
    } = result)
  }
  await ctx.render('index', data)
}
