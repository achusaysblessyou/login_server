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

#=begin
  def create
    @user = params[:user]
    @password = params[:password]

    errCode = 1

    if @user.length > 128 and @user.length <= 0
      errCode = -3
    end
    if @password.length > 128
      errCode = -4
    end

    @userObj = User.new({:user => @user,:password => @password, :count => 1})

    respond_to do |format|
      if @userObj.save and errCode == 1
        format.json{render(:json => {:errCode => 1, :count => 1}) }
      else
        if errCode < 1
          format.json{render(:json => {:errCode => errCode}) }
        else
          format.json{render(:json => {:errCode => -2})}
        end
      end
    end
  end
#=end

#=begin
  def login
    @user = params[:user]
    @password = params[:password]

    errCode = 1
    @userObj = User.find_by_user_and_password(@user, @password)
    if(@userObj == nil)
      errCode = -1
    end

    respond_to do |format|
      if errCode == -1
        format.json{render(:json => {:errCode => errCode})}
      else
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

  def deleteAllRecords
    User.delete_all
    respond_to do |format|
      format.json{render(:json => {:errCode => 1})}
    end
  end

  #def unitTests
  #  respond_to do |format|
  #    format.json{render(:json => {:errCode => 1})}
  #  end
  #end

#=end

  # POST /users
  # POST /users.json
=begin
  def create
    @user = User.new(params[:user])

    print "Kirby"
    print @user

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render json: @user, status: :created, location: @user }
      else
        format.html { render action: "new" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end
=end
  
  
end
