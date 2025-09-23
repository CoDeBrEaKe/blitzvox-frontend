const page = () => {
  return (
    <div className="bg-white shadow rounded-lg ">
      <h1>Login</h1>
      <form action="">
        <label for="username">Username</label>
        <input type="text" name="username" id="username" value="" />
        <label for="password">Password</label>
        <input type="password" name="password" id="password" value="" />
      </form>
    </div>
  );
};

export default page;
