function InviteRedirect() {
  return (
    <div>
      <p>
        after the user has been authenticated, i will make a post request to join a
        group, if i am not part i get added, afterwards i am redirected to the
        appropriate page
      </p>
      <p>
        I will pass the userId in my zustand store and make the request.
      </p>
      <p>
        if not found redirect to not found page.
      </p>
    </div>
  );
}

export default InviteRedirect;
