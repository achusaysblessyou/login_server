class ApplicationController < ActionController::Base
  protect_from_forgery

  def deleteAllRecords
    User.delete_all
    respond_to do |format|
      format.json{render(:json => {:errCode => 1})}
    end
  end

  def unitTests
    #this is for running RAILS UNIT TESTS, replaced by RSPEC tests
    #left here for reference
=begin
    %x(rake test:units > out.tmp)
    file = File.open("out.tmp","r")
    fileString = ""
    while(line = file.gets)
      fileString = fileString + line
    end
    file.close
    totalTests = Integer(fileString[/[0-9]+\stests/][/[0-9]+/])
    nrFailed = Integer(fileString[/[0-9]+\sfailures/][/[0-9]+/])
=end
    #==================== ACTUAL CODE START =====================
    #run rspec shell command and output to out.tmp
    %x(rspec > out.tmp)
    #open file out.tmp w/ read priviledges
    file = File.open("out.tmp","r")
    fileString = ""
    #concat each line of file to fileString
    while(line = file.gets)
      fileString = fileString + line
    end
    file.close
    #using regex, get number of examples(tests)
    totalTests = Integer(fileString[/[0-9]+\sexamples/][/[0-9]+/])
    #using regex, get number of failed examples(tests)
    nrFailed = Integer(fileString[/[0-9]+\sfailures/][/[0-9]+/])
    respond_to do |format|
      #reply with JSON response (totalTests, nrFailed, output)
      format.json{render(:json => {:totalTests => totalTests, :nrFailed => nrFailed, :output => fileString})}
    end
  end

end
