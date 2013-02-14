class UsersController < ApplicationController
  # GET /users
  # GET /users.json
  def index
    @users = User.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @users }
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    @user = User.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/new
  # GET /users/new.json
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end

  #called by clients.html "add user" button
  def create
    #grab user and password
    @user = params[:user]
    @password = params[:password]

    errCode = 1

    #check length of user & set appropriate errCode
    if @user.length > 128 or @user.length <= 0
      errCode = -3
    end
    #check length of password & set appropriate errCode
    if @password.length > 128
      errCode = -4
    end

    respond_to do |format|
      if errCode < 1
        #if there's already an error, return just errCode
        format.json{render(:json => {:errCode => errCode}) }
      else
        #try to create user
        @userObj = User.new({:user => @user,:password => @password, :count => 1})
        if @userObj.save
          #if I can save user (user doesn't share user), return count = 1 and errCode = 1
          format.json{render(:json => {:errCode => 1, :count => 1}) }
        else
          #if user has same user with another, return errCode -2 for user already exists
          format.json{render(:json => {:errCode => -2})}
        end
      end
    end
  end

  #called by clients.html "Login" button
  def login
    #grab user and password
    @user = params[:user]
    @password = params[:password]

    #default errCode to 1
    errCode = 1
    @userObj = User.find_by_user_and_password(@user, @password)
    #try to find user, if doesn't exist, then errCode is -1
    if(@userObj == nil)
      errCode = -1
    end

    respond_to do |format|
      if errCode == -1
        #user doesn't exist, return only errCode
        format.json{render(:json => {:errCode => errCode})}
      else
        #if user exists, increment count and return errCode 1 and count
        @userObj.update_attributes({:count => @userObj.count + 1})
        format.json{render(:json => {:errCode => errCode, :count => @userObj.count})}
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.json
  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end 
  
end
