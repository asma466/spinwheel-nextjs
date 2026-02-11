  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     const response = await login(email, password);

  //     if (response.error) {
  //       setError(response.error);
  //     } else if (response.data?.token) {
  //       localStorage.setItem('token', response.data.token);
  //       localStorage.setItem('user', JSON.stringify(response.data.user));
  //       router.push('/dashboard');
  //     }
  //   } catch (err) {
  //     setError('Login failed. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
